import { api } from "./api"

export interface MetricCard {
  label: string
  value: string
  numeric_value: number
  unit?: string
  trend?: string
  trend_positive?: boolean
  subtitle?: string
}

export interface TrainerDashboardData {
  director_name: string
  designation: string
  department: string
  last_updated: string
  is_demo_dataset: boolean
  employees_assessed: number
  total_employees: number
  average_readiness_pct: number
  critical_gaps_count: number
  active_learning_plans_count: number
  reassessments_completed_count: number
  avg_competency_gain_pct: number
  critical_alerts: Array<{
    id: string
    title: string
    department: string
    affected_count: number
    severity: string
  }>
  top_workforce_gaps: Array<{
    competency: string
    gap_pct: number
    criticality: string
  }>
  recent_reassessments: Array<{
    employee: string
    competency: string
    before: number
    after: number
    gain: string
  }>
}

export interface CompetencyGapDistributionItem {
  competency_code: string
  competency_name: string
  category: string
  below_threshold_count: number
  below_threshold_pct: number
  average_level: number
  required_level: number
  criticality: string
}

export interface DepartmentComparisonItem {
  department_name: string
  employee_count: number
  average_readiness_pct: number
  critical_gaps_count: number
  training_completion_pct: number
}

export interface RoleComparisonItem {
  role_code: string
  role_name: string
  department: string
  employee_count: number
  readiness_pct: number
  top_gap: string
}

export interface HeatmapCell {
  department: string
  competency_code: string
  competency_name: string
  current_avg: number
  required_avg: number
  gap: number
  criticality: string
  affected_employees: number
}

export interface ReadinessTrendPoint {
  date_label: string
  overall_readiness_pct: number
  reassessments_count: number
}

export interface WorkforceAnalyticsData {
  overall_readiness_pct: number
  required_readiness_pct: number
  readiness_gap_pct: number
  readiness_trend: string
  gap_distribution: CompetencyGapDistributionItem[]
  department_comparison: DepartmentComparisonItem[]
  role_comparison: RoleComparisonItem[]
  heatmap_matrix: HeatmapCell[]
  trend_history: ReadinessTrendPoint[]
}

export interface EmployeeListItem {
  id: string
  name: string
  employee_code: string
  email: string
  role_name: string
  department: string
  domain: string
  overall_readiness_pct: number
  critical_gaps_count: number
  learning_plan_status: string
  last_assessed_at?: string
  avatar_initials: string
}

export interface CompetencyTwinRow {
  competency_id: string
  competency_code: string
  competency_name: string
  category: string
  current_level: number
  required_level: number
  gap: number
  gap_pct: number
  status: string
  last_assessed?: string
  why_is_this_a_gap: string
  why_important_for_role: string
  recommended_intervention: string
}

export interface EmployeeEvidenceItem {
  id: string
  title: string
  evidence_type: string
  score_or_status: string
  date: string
  details: string
}

export interface EmployeeDetailData {
  id: string
  name: string
  employee_code: string
  email: string
  designation: string
  department: string
  domain: string
  role_code: string
  role_name: string
  overall_readiness_pct: number
  readiness_status: string
  date_of_joining?: string
  competency_twin: CompetencyTwinRow[]
  evidence_history: EmployeeEvidenceItem[]
  summary_ai_note: string
}

export interface QuestionOption {
  id?: string
  text: string
  is_correct: boolean
}

export interface QuestionReviewItem {
  id: string
  text: string
  question_type: string
  difficulty: string
  competency_code: string
  competency_name: string
  source_doc_id?: string
  source_doc_title?: string
  source_page?: number
  source_chunk_text?: string
  grounding_score: number
  ai_quality_passed: boolean
  review_status: string
  options: QuestionOption[]
  explanation: string
  rejection_reason?: string
  reviewed_by?: string
  reviewed_at?: string
}

export interface QuestionReviewSummary {
  total_generated: number
  approved_count: number
  pending_review_count: number
  rejected_count: number
  avg_grounding_score: number
  documents?: Array<{
    id: string
    title: string
    filename: string
    count: number
  }>
  questions: QuestionReviewItem[]
}

export interface TrainingEffectivenessData {
  total_trained_employees: number
  total_reassessed_employees: number
  overall_improved_pct: number
  avg_competency_gain_pct: number
  competency_effectiveness: Array<{
    competency_code: string
    competency_name: string
    category: string
    before_avg_score: number
    after_avg_score: number
    competency_gain_pct: number
    employees_trained_count: number
    reassessed_count: number
    improved_count: number
    unchanged_count: number
    declining_count: number
  }>
  before_after_trajectories: Array<{
    employee_id: string
    employee_name: string
    department: string
    competency_name: string
    before_score: number
    after_score: number
    gain: number
    intervention_course: string
    reassessment_date: string
  }>
}

export interface LearningPlanMonitorItem {
  plan_id: string
  employee_id: string
  employee_name: string
  department: string
  role_name: string
  priority_gap: string
  course_title: string
  provider_name: string
  progress_pct: number
  status: string
  start_date: string
  last_activity: string
  days_inactive: number
}

export interface AIInsightItem {
  id: string
  title: string
  category: string
  evidence: string
  metric: string
  affected_population: string
  recommended_action: string
  priority: string
}

export interface FutureSkillItem {
  skill_code: string
  skill_name: string
  domain: string
  description: string
  current_workforce_readiness_pct: number
  target_future_readiness_pct: number
  gap_pct: number
  priority: string
  recommended_pathway: string
}

export interface TrainerAlertItem {
  id: string
  title: string
  message: string
  severity: string
  category: string
  timestamp: string
  is_read: boolean
  action_link?: string
}

export interface TrainerReportItem {
  id: string
  title: string
  category: string
  description: string
  generated_at: string
  format_options: string[]
  record_count: number
}

export interface AILogItem {
  id: string
  timestamp: string
  component: string
  action: string
  details: string
  latency_ms: number
  grounding_score?: number
  status: string
}

function buildQueryString(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      query.append(key, val)
    }
  }
  const str = query.toString()
  return str ? `?${str}` : ""
}

export const trainerApi = {
  getDashboard: async (timeframe = "30_days", department?: string) => {
    const qs = buildQueryString({ timeframe, department })
    return await api.get<TrainerDashboardData>(`/trainer/dashboard${qs}`)
  },

  getWorkforceAnalytics: async (department?: string, role?: string) => {
    const qs = buildQueryString({ department, role })
    return await api.get<WorkforceAnalyticsData>(`/trainer/analytics/workforce${qs}`)
  },

  getEmployees: async (search?: string, department?: string, role?: string, status?: string) => {
    const qs = buildQueryString({ search, department, role, status })
    return await api.get<EmployeeListItem[]>(`/trainer/employees${qs}`)
  },

  getEmployeeDetail: async (userId: string) => {
    return await api.get<EmployeeDetailData>(`/trainer/employees/${userId}`)
  },

  getQuestionReview: async (reviewStatus?: string, documentId?: string) => {
    const qs = buildQueryString({ review_status: reviewStatus, document_id: documentId })
    return await api.get<QuestionReviewSummary>(`/trainer/questions/review${qs}`)
  },

  reviewQuestion: async (questionId: string, action: string, feedback?: string) => {
    return await api.put(`/documents/questions/${questionId}/review`, {
      action,
      feedback
    })
  },

  getAssessmentAnalytics: async (assessmentId: string) => {
    return await api.get(`/trainer/assessments/${assessmentId}/analytics`)
  },

  getLearningPlans: async (department?: string, status?: string) => {
    const qs = buildQueryString({ department, status })
    return await api.get<{
      total_plans: number
      in_progress_count: number
      completed_count: number
      at_risk_count: number
      overdue_count: number
      plans: LearningPlanMonitorItem[]
    }>(`/trainer/learning-plans${qs}`)
  },

  getTrainingEffectiveness: async () => {
    return await api.get<TrainingEffectivenessData>("/trainer/training-effectiveness")
  },

  getAIInsights: async () => {
    return await api.get<AIInsightItem[]>("/trainer/insights")
  },

  getFutureSkills: async () => {
    return await api.get<FutureSkillItem[]>("/trainer/future-skills")
  },

  getAILogs: async () => {
    return await api.get<AILogItem[]>("/trainer/ai-logs")
  },

  getAlerts: async () => {
    return await api.get<TrainerAlertItem[]>("/trainer/alerts")
  },

  getReports: async () => {
    return await api.get<TrainerReportItem[]>("/trainer/reports")
  }
}

