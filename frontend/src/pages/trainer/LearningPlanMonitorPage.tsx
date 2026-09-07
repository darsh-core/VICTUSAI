import React, { useState, useEffect } from "react"
import { Map, AlertTriangle, CheckCircle2, Clock, Filter, RefreshCw, ChevronRight } from "lucide-react"

import { trainerApi, LearningPlanMonitorItem } from "../../services/trainerApi"

export const LearningPlanMonitorPage: React.FC = () => {
  const [plans, setPlans] = useState<LearningPlanMonitorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDept, setSelectedDept] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getLearningPlans(selectedDept, selectedStatus)
      setPlans(res.plans)
    } catch (err: any) {
      setError(err.message || "Failed to load learning plan monitor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [selectedDept, selectedStatus])

  const filteredPlans = plans.filter(p => {
    if (selectedDept !== "ALL" && p.department !== selectedDept) return false
    if (selectedStatus !== "ALL" && p.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <Map className="h-4 w-4" /> Workforce Capacity Building Tracker
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Learning Plan Progress Monitoring</h1>
          <p className="text-sm text-slate-500">Track active training interventions, completion rates, and flag at-risk inactive employees</p>
        </div>

        <button 
          onClick={fetchPlans}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Plans
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-gov-blue-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Agricultural Statistics Division">Agricultural Statistics</option>
            <option value="Economic Statistics Division">Economic Statistics</option>
            <option value="Social Statistics Division">Social Statistics</option>
            <option value="Labour Statistics Division">Labour Statistics</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-gov-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="At Risk">At Risk (&gt;14 days inactive)</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing {filteredPlans.length} active learning plans
        </div>
      </div>

      {/* Learning Plans Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <RefreshCw className="h-7 w-7 text-gov-blue-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Fetching workforce learning plans...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-4">Employee & Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Priority Gap</th>
                  <th className="p-4">Intervention Course</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Progress %</th>
                  <th className="p-4">Last Activity</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {filteredPlans.map((plan, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{plan.employee_name}</div>
                      <span className="text-[11px] text-slate-500">{plan.role_name}</span>
                    </td>
                    <td className="p-4 text-slate-700">{plan.department}</td>
                    <td className="p-4">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        {plan.priority_gap}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                      {plan.course_title}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gov-blue-100 text-gov-blue-800">
                        {plan.provider_name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{plan.progress_pct}%</span>
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${plan.progress_pct === 100 ? "bg-emerald-500" : "bg-gov-blue-500"}`}
                            style={{ width: `${plan.progress_pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      <div>{plan.last_activity}</div>
                      {plan.days_inactive > 14 && (
                        <span className="text-[10px] font-bold text-amber-700 block">
                          {plan.days_inactive} days inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        plan.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : plan.status === "At Risk"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-gov-blue-100 text-gov-blue-800"
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
