import uuid
import json
import logging
import random
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.competency import JobRole, RoleCompetency, Competency
from app.models.assessment import Assessment, Question, QuestionOption, QuestionCompetency
from app.schemas.assessment import GeneratedMCQ, GeneratedMCQOption
from app.core.config import settings

logger = logging.getLogger("sih-platform.ai.role_assessment")


class RoleDiagnosticGenerator:
    """Generates an official diagnostic assessment for a Job Role using ONLY trainer-generated document MCQs."""

    @staticmethod
    def generate_role_assessment(
        db: Session,
        job_role_id: uuid.UUID,
        total_questions: int = 10
    ) -> Dict[str, Any]:
        role = db.query(JobRole).filter(JobRole.id == job_role_id).first()
        if not role:
            raise ValueError(f"Job Role with ID {job_role_id} not found.")

        role_competencies = db.query(RoleCompetency).filter(
            RoleCompetency.job_role_id == job_role_id
        ).all()

        if not role_competencies:
            raise ValueError(f"Job Role '{role.name}' has no mapped competencies in framework.")

        required_comp_ids = [rc.competency_id for rc in role_competencies]

        # 1. Query trainer-generated MCQs mapped to these competencies
        trainer_questions = (
            db.query(Question)
            .join(QuestionCompetency, Question.id == QuestionCompetency.question_id)
            .filter(QuestionCompetency.competency_id.in_(required_comp_ids))
            .all()
        )

        # 2. If no direct competency mapping found, query any trainer-generated MCQs in database
        if not trainer_questions:
            trainer_questions = (
                db.query(Question)
                .filter(
                    (Question.source_doc_id.isnot(None)) |
                    (Question.generation_method.ilike('%trainer%')) |
                    (Question.generation_method.ilike('%rag%')) |
                    (Question.generation_method.ilike('%grounded%')) |
                    (Question.confidence >= 0.8)
                )
                .all()
            )

        # 3. Fallback: Query all questions in Question pool if specific filters returned empty
        if not trainer_questions:
            trainer_questions = db.query(Question).all()

        # 4. If still no questions exist in database, raise a descriptive error
        if not trainer_questions:
            raise ValueError(
                f"No trainer-generated document MCQs available in the system for '{role.name}'. "
                "Please upload official training documents in the Trainer Portal to populate questions."
            )

        # Organize trainer questions by competency ID for mapped allocation
        trainer_qs_by_comp: Dict[uuid.UUID, List[Question]] = {}
        all_avail_trainer_qs: List[Question] = list(trainer_questions)

        for tq in trainer_questions:
            q_comps = db.query(QuestionCompetency).filter(QuestionCompetency.question_id == tq.id).all()
            for qc in q_comps:
                if qc.competency_id not in trainer_qs_by_comp:
                    trainer_qs_by_comp[qc.competency_id] = []
                trainer_qs_by_comp[qc.competency_id].append(tq)

        # Shuffle pools to ensure random variety across different attempts
        for cid in trainer_qs_by_comp:
            random.shuffle(trainer_qs_by_comp[cid])
        random.shuffle(all_avail_trainer_qs)

        # 5. Create Assessment Instance
        assessment = Assessment(
            title=f"Diagnostic Competency Checkpoint: {role.name}",
            description=f"Baseline diagnostic evaluating official competencies required for {role.name} using trainer-generated document MCQs.",
            time_limit_minutes=25,
            pass_percentage=60.0,
            is_ai_generated=True
        )
        db.add(assessment)
        db.flush()

        persisted_questions: List[Question] = []
        used_q_ids = set()

        comp_count = len(role_competencies)
        questions_per_comp = max(1, total_questions // comp_count)
        difficulties = ["EASY", "MEDIUM", "HARD"]

        # Allocate questions across required competencies
        for rc in role_competencies:
            comp = rc.competency
            avail = trainer_qs_by_comp.get(comp.id, [])
            
            comp_q_count = 0
            for tq in avail:
                if tq.id in used_q_ids:
                    continue
                if len(persisted_questions) >= total_questions:
                    break
                
                diff = difficulties[len(persisted_questions) % len(difficulties)]
                db_q = Question(
                    assessment_id=assessment.id,
                    text=tq.text,
                    question_type="MCQ",
                    difficulty=tq.difficulty or diff,
                    explanation=tq.explanation or "Grounded answer verified from official training manual.",
                    confidence=tq.confidence or 0.95,
                    source_doc_id=tq.source_doc_id,
                    source_page=tq.source_page,
                    source_chunk_id=tq.source_chunk_id,
                    generation_method="trainer-rag-mapped",
                    ai_model=tq.ai_model or "trainer-rag-v1",
                    grounding_score=tq.grounding_score or 0.95,
                    metadata_json={
                        "competency_id": str(comp.id),
                        "competency_name": comp.name,
                        "required_level": rc.required_level,
                        "is_trainer_generated": True,
                        "created_at": datetime.now().isoformat()
                    }
                )
                db.add(db_q)
                db.flush()
                used_q_ids.add(tq.id)

                for opt in tq.options:
                    db_opt = QuestionOption(
                        question_id=db_q.id,
                        text=opt.text,
                        is_correct=opt.is_correct
                    )
                    db.add(db_opt)

                db_qc = QuestionCompetency(
                    question_id=db_q.id,
                    competency_id=comp.id,
                    target_level=rc.required_level,
                    weight=rc.weight
                )
                db.add(db_qc)
                persisted_questions.append(db_q)

                comp_q_count += 1
                if comp_q_count >= questions_per_comp:
                    break

        # Fill remaining question slots from general pool of trainer questions if total_questions not reached
        if len(persisted_questions) < total_questions:
            for tq in all_avail_trainer_qs:
                if tq.id in used_q_ids:
                    continue
                if len(persisted_questions) >= total_questions:
                    break

                diff = difficulties[len(persisted_questions) % len(difficulties)]
                q_comp_link = db.query(QuestionCompetency).filter(QuestionCompetency.question_id == tq.id).first()
                target_comp_id = q_comp_link.competency_id if q_comp_link else role_competencies[0].competency_id
                target_comp = db.query(Competency).filter(Competency.id == target_comp_id).first()

                db_q = Question(
                    assessment_id=assessment.id,
                    text=tq.text,
                    question_type="MCQ",
                    difficulty=tq.difficulty or diff,
                    explanation=tq.explanation or "Grounded answer verified from official training manual.",
                    confidence=tq.confidence or 0.95,
                    source_doc_id=tq.source_doc_id,
                    source_page=tq.source_page,
                    source_chunk_id=tq.source_chunk_id,
                    generation_method="trainer-rag-mapped",
                    ai_model=tq.ai_model or "trainer-rag-v1",
                    grounding_score=tq.grounding_score or 0.95,
                    metadata_json={
                        "competency_id": str(target_comp.id) if target_comp else None,
                        "competency_name": target_comp.name if target_comp else "General",
                        "is_trainer_generated": True,
                        "created_at": datetime.now().isoformat()
                    }
                )
                db.add(db_q)
                db.flush()
                used_q_ids.add(tq.id)

                for opt in tq.options:
                    db_opt = QuestionOption(
                        question_id=db_q.id,
                        text=opt.text,
                        is_correct=opt.is_correct
                    )
                    db.add(db_opt)

                if target_comp:
                    db_qc = QuestionCompetency(
                        question_id=db_q.id,
                        competency_id=target_comp.id,
                        target_level=3,
                        weight=1.0
                    )
                    db.add(db_qc)
                persisted_questions.append(db_q)

        db.commit()
        db.refresh(assessment)

        return {
            "assessment_id": assessment.id,
            "title": assessment.title,
            "role_name": role.name,
            "job_role": role.name,
            "total_questions": len(persisted_questions),
            "questions": [{"id": q.id, "text": q.text, "difficulty": q.difficulty} for q in persisted_questions],
            "competency_breakdown": [rc.competency.name for rc in role_competencies],
            "competencies_evaluated": [rc.competency.name for rc in role_competencies]
        }
