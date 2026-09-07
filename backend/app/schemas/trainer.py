import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# =========================================================
# DASHBOARD SCHEMAS
# =========================================================
class MetricCard(BaseModel):
    label: str
    value: str
    numeric_value: float
    unit: Optional[str] = None
    trend: Optional[str] = None
    trend_positive: Optional[bool] = None
    subtitle: Optional[str] = None

class TrainerDashboardResponse(BaseModel):
    director_name: str
    designation: str
    department: str
    last_updated: str
    is_demo_dataset: bool = True
    
    # Top KPI Metrics
    employees_assessed: int
    total_employees: int
    average_readiness_pct: float
    critical_gaps_count: int
    active_learning_plans_count: int
    reassessments_completed_count: int
    avg_competency_gain_pct: float
    
    # High Priority Action Items
    critical_alerts: List[Dict[str, Any]]
    top_workforce_gaps: List[Dict[str, Any]]
    recent_reassessments: List[Dict[str, Any]]

# =========================================================
# WORKFORCE ANALYTICS SCHEMAS
# =========================================================
class CompetencyGapDistributionItem(BaseModel):
    competency_code: str
    competency_name: str
    category: str
    below_threshold_count: int
    below_threshold_pct: float
    average_level: float
    required_level: float
    criticality: str  # HIGH, MEDIUM, LOW

class DepartmentComparisonItem(BaseModel):
    department_name: str
    employee_count: int
    average_readiness_pct: float
    critical_gaps_count: int
    training_completion_pct: float

class RoleComparisonItem(BaseModel):
    role_code: str
    role_name: str
    department: str
    employee_count: int
    readiness_pct: float
    top_gap: str

class HeatmapCell(BaseModel):
    department: str
    competency_code: str
    competency_name: str
    current_avg: float
    required_avg: float
    gap: float
    criticality: str
    affected_employees: int

class ReadinessTrendPoint(BaseModel):
    date_label: str
    overall_readiness_pct: float
    reassessments_count: int

class WorkforceAnalyticsResponse(BaseModel):
    overall_readiness_pct: float
    required_readiness_pct: float
    readiness_gap_pct: float
    readiness_trend: str
    
    gap_distribution: List[CompetencyGapDistributionItem]
    department_comparison: List[DepartmentComparisonItem]
    role_comparison: List[RoleComparisonItem]
    heatmap_matrix: List[HeatmapCell]
    trend_history: List[ReadinessTrendPoint]

# =========================================================
# EMPLOYEE SCHEMAS
# =========================================================
class EmployeeListItem(BaseModel):
    id: uuid.UUID
    name: str
    employee_code: str
    email: str
    role_name: str
    department: str
    domain: str
    overall_readiness_pct: float
    critical_gaps_count: int
    learning_plan_status: str  # Active, Completed, At Risk, Not Started
    last_assessed_at: Optional[str]
    avatar_initials: str

class CompetencyTwinRow(BaseModel):
    competency_id: uuid.UUID
    competency_code: str
    competency_name: str
    category: str
    current_level: float
    required_level: float
    gap: float
    gap_pct: float
    status: str  # Critical, Attention, Strong
    last_assessed: Optional[str]
    why_is_this_a_gap: str
    why_important_for_role: str
    recommended_intervention: str

class EmployeeEvidenceItem(BaseModel):
    id: str
    title: str
    evidence_type: str  # Assessment, Practical Assessment, Learning Completion, Reassessment
    score_or_status: str
    date: str
    details: str

class EmployeeDetailResponse(BaseModel):
    id: uuid.UUID
    name: str
    employee_code: str
    email: str
    designation: str
    department: str
    domain: str
    role_code: str
    role_name: str
    overall_readiness_pct: float
    readiness_status: str
    date_of_joining: Optional[str]
    
    competency_twin: List[CompetencyTwinRow]
    evidence_history: List[EmployeeEvidenceItem]
    summary_ai_note: str

# =========================================================
# QUESTION REVIEW & QUALITY GATE SCHEMAS
# =========================================================
class QuestionOptionSchema(BaseModel):
    id: Optional[uuid.UUID] = None
    text: str
    is_correct: bool

class DocumentFilterItem(BaseModel):
    id: uuid.UUID
    title: str
    filename: str
    count: int

class QuestionReviewItem(BaseModel):
    id: uuid.UUID
    text: str
    question_type: str
    difficulty: str
    competency_code: str
    competency_name: str
    source_doc_id: Optional[uuid.UUID]
    source_doc_title: Optional[str]
    source_page: Optional[int]
    source_chunk_text: Optional[str] = None
    grounding_score: float
    ai_quality_passed: bool
    review_status: str  # PENDING_REVIEW, APPROVED, REJECTED
    options: List[QuestionOptionSchema]
    explanation: str
    rejection_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[str] = None

class QuestionReviewSummary(BaseModel):
    total_generated: int
    approved_count: int
    pending_review_count: int
    rejected_count: int
    avg_grounding_score: float
    documents: List[DocumentFilterItem] = []
    questions: List[QuestionReviewItem]

# =========================================================
# ASSESSMENT ANALYTICS SCHEMAS
# =========================================================
class QuestionPerformanceItem(BaseModel):
    question_id: uuid.UUID
    text: str
    competency_name: str
    difficulty: str
    correct_pct: float
    total_responses: int
    needs_review: bool
    flag_reason: Optional[str] = None

class AssessmentAnalyticsResponse(BaseModel):
    assessment_id: uuid.UUID
    title: str
    target_role: str
    participants_count: int
    completion_rate_pct: float
    average_score_pct: float
    competency_breakdown: List[Dict[str, Any]]
    question_performances: List[QuestionPerformanceItem]

# =========================================================
# LEARNING PLAN MONITORING SCHEMAS
# =========================================================
class LearningPlanMonitorItem(BaseModel):
    plan_id: uuid.UUID
    employee_id: uuid.UUID
    employee_name: str
    department: str
    role_name: str
    priority_gap: str
    course_title: str
    provider_name: str
    progress_pct: float
    status: str  # Not Started, In Progress, Completed, At Risk, Overdue
    start_date: str
    last_activity: str
    days_inactive: int

class LearningPlanMonitorResponse(BaseModel):
    total_plans: int
    in_progress_count: int
    completed_count: int
    at_risk_count: int
    overdue_count: int
    plans: List[LearningPlanMonitorItem]

# =========================================================
# TRAINING EFFECTIVENESS & BEFORE/AFTER SCHEMAS
# =========================================================
class TrainingEffectivenessItem(BaseModel):
    competency_code: str
    competency_name: str
    category: str
    before_avg_score: float
    after_avg_score: float
    competency_gain_pct: float
    employees_trained_count: int
    reassessed_count: int
    improved_count: int
    unchanged_count: int
    declining_count: int

class BeforeAfterTrajectoryItem(BaseModel):
    employee_id: uuid.UUID
    employee_name: str
    department: str
    competency_name: str
    before_score: float
    after_score: float
    gain: float
    intervention_course: str
    reassessment_date: str

class TrainingEffectivenessResponse(BaseModel):
    total_trained_employees: int
    total_reassessed_employees: int
    overall_improved_pct: float
    avg_competency_gain_pct: float
    competency_effectiveness: List[TrainingEffectivenessItem]
    before_after_trajectories: List[BeforeAfterTrajectoryItem]

# =========================================================
# AI INSIGHTS & FUTURE SKILLS SCHEMAS
# =========================================================
class AIInsightResponseItem(BaseModel):
    id: str
    title: str
    category: str  # Gap, High Gain, Risk, Strategic
    evidence: str
    metric: str
    affected_population: str
    recommended_action: str
    priority: str  # HIGH, MEDIUM, LOW

class FutureSkillItem(BaseModel):
    skill_code: str
    skill_name: str
    domain: str
    description: str
    current_workforce_readiness_pct: float
    target_future_readiness_pct: float
    gap_pct: float
    priority: str
    recommended_pathway: str

# =========================================================
# ALERTS & REPORTS SCHEMAS
# =========================================================
class TrainerAlertItem(BaseModel):
    id: str
    title: str
    message: str
    severity: str  # HIGH, MEDIUM, LOW
    category: str
    timestamp: str
    is_read: bool = False
    action_link: Optional[str] = None

class TrainerReportItem(BaseModel):
    id: str
    title: str
    category: str
    description: str
    generated_at: str
    format_options: List[str]
    record_count: int

class AILogItem(BaseModel):
    id: str
    timestamp: str
    component: str  # RAG Vector Search, LLM MCQ Generator, Quality Gate Audit, Copilot Chat, Document Ingestion
    action: str
    details: str
    latency_ms: int
    grounding_score: Optional[float] = None
    status: str  # SUCCESS, WARNING, INFO

