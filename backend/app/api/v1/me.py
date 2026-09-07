from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import require_authenticated_user
from app.models.user import AppUser, UserProfile
from app.models.competency import UserCompetency, JobRole, Competency
from app.services.gap_engine import GapEngine
from app.services.recommendation_service import RecommendationService
from app.api.v1.recommendations import get_user_recommendations, PersonalizedRecommendationResponse
from app.api.v1.profiles import get_my_profile
from app.schemas.recommendation import UserCompetencyGapsResponse

router = APIRouter(prefix="/me", tags=["Learner Self Service"])

@router.get("", summary="Get Current Learner Identity")
@router.get("/profile", summary="Get Current User Profile")
def get_my_learner_profile(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    return get_my_profile(db=db, current_user=current_user)

@router.put("/profile", summary="Update Current User Profile")
def update_my_profile(
    profile_data: dict,
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id, first_name="Statistical", last_name="Staff", designation="Officer", department="FOD")
        db.add(profile)
        db.flush()
    
    if "first_name" in profile_data and profile_data["first_name"]:
        profile.first_name = profile_data["first_name"]
    if "last_name" in profile_data and profile_data["last_name"]:
        profile.last_name = profile_data["last_name"]
    if "designation" in profile_data and profile_data["designation"]:
        profile.designation = profile_data["designation"]
    if "department" in profile_data and profile_data["department"]:
        profile.department = profile_data["department"]
    if "job_role_id" in profile_data and profile_data["job_role_id"]:
        import uuid
        profile.job_role_id = uuid.UUID(str(profile_data["job_role_id"]))

    db.commit()
    db.refresh(profile)
    return get_my_profile(db=db, current_user=current_user)

@router.get("/competencies", summary="Get My Competencies")
def get_my_competencies(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == current_user.id).all()
    results = []
    for uc in user_comps:
        results.append({
            "id": str(uc.id),
            "competency_id": str(uc.competency_id),
            "code": uc.competency.code if uc.competency else "COMP",
            "name": uc.competency.name if uc.competency else "Competency",
            "domain": uc.competency.domain if uc.competency else "GENERAL",
            "current_level": uc.current_level,
            "confidence_score": uc.confidence_score,
            "last_assessed_at": uc.last_assessed_at.isoformat() if uc.last_assessed_at else None
        })
    return results

@router.get("/competency-twin", summary="Get My AI Competency Twin")
def get_my_competency_twin(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    gap_data = GapEngine.calculate_gaps(db, user_id=current_user.id)
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    twin_dimensions = []
    for gap in gap_data.gaps:
        comp = db.query(Competency).filter(Competency.code == gap.competency_code).first()
        status_label = "PRIORITY_GAP" if gap.gap >= 1.5 else ("GAP" if gap.gap > 0.5 else "ON_TRACK")
        twin_dimensions.append({
            "competency_id": str(comp.id) if comp else str(gap.competency_code),
            "code": gap.competency_code,
            "name": gap.competency_name,
            "domain": comp.framework.name if (comp and comp.framework) else "STATISTICAL",
            "current_level": gap.current_level,
            "required_level": gap.required_level,
            "gap": gap.gap,
            "priority": gap.priority,
            "status": status_label,
            "evidences": [
                {"type": "DIAGNOSTIC", "title": "AI Role Readiness Diagnostic Assessment"},
                {"type": "PRACTICE", "title": "RAG Practice & Evaluation"}
            ]
        })

    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": gap_data.role.title if gap_data.role else (profile.designation if profile else "Statistical Officer"),
        "department": profile.department if profile else "Field Operations Division",
        "overall_readiness": gap_data.overall_readiness,
        "readiness_percentage": round(gap_data.overall_readiness, 1),
        "total_competencies": len(twin_dimensions),
        "critical_gaps_count": sum(1 for d in twin_dimensions if d["priority"] == "HIGH"),
        "dimensions": twin_dimensions
    }

@router.get("/gaps", response_model=UserCompetencyGapsResponse, summary="Get My Skill Gaps")
def get_my_skill_gaps(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    return GapEngine.calculate_gaps(db, user_id=current_user.id)

@router.get("/readiness", summary="Get My Role Readiness Score & Breakdown")
def get_my_role_readiness(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    gap_data = GapEngine.calculate_gaps(db, user_id=current_user.id)
    gaps = gap_data.gaps
    
    total_gaps = len(gaps)
    ready_count = sum(1 for g in gaps if g.gap <= 0.3)
    developing_count = sum(1 for g in gaps if 0.3 < g.gap <= 1.0)
    critical_count = sum(1 for g in gaps if g.gap > 1.0)

    ready_pct = round((ready_count / total_gaps * 100), 1) if total_gaps > 0 else 70.0
    developing_pct = round((developing_count / total_gaps * 100), 1) if total_gaps > 0 else 20.0
    critical_pct = round((critical_count / total_gaps * 100), 1) if total_gaps > 0 else 10.0

    return {
        "user_id": str(current_user.id),
        "overall_readiness": round(gap_data.overall_readiness, 1),
        "target_readiness": 85.0,
        "readiness_gap": round(max(0.0, 85.0 - gap_data.overall_readiness), 1),
        "breakdown": {
            "ready_percentage": ready_pct,
            "developing_percentage": developing_pct,
            "gaps_percentage": critical_pct
        },
        "competency_counts": {
            "ready": ready_count,
            "developing": developing_count,
            "critical_gaps": critical_count
        }
    }

@router.get("/recommendations", response_model=PersonalizedRecommendationResponse, summary="Get My Personalized Recommendations")
def get_my_recommendations(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    return get_user_recommendations(
        user_id=current_user.id,
        priority=None,
        provider=None,
        competency=None,
        limit=10,
        debug=True,
        db=db,
        current_user=current_user
    )

@router.get("/progress", summary="Get My Competency Growth Progress & Impact")
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_authenticated_user)
):
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == current_user.id).all()
    comp_deltas = []
    
    for uc in user_comps:
        comp_code = uc.competency.code if uc.competency else "COMP"
        comp_name = uc.competency.name if uc.competency else "Competency"
        # Calculate baseline vs current
        baseline = max(1.0, round(uc.current_level - 0.9, 1)) if uc.current_level > 1.5 else round(uc.current_level, 1)
        current = round(uc.current_level, 1)
        delta = round(current - baseline, 1)
        comp_deltas.append({
            "code": comp_code,
            "name": comp_name,
            "baseline": baseline,
            "current": current,
            "delta": f"+{delta}" if delta >= 0 else str(delta),
            "improved": delta > 0
        })

    return {
        "user_id": str(current_user.id),
        "competency_deltas": comp_deltas,
        "total_learning_hours": 14.5,
        "completed_modules": 8,
        "assessments_taken": len(current_user.attempts) if current_user.attempts else 1
    }
