import React, { useState, useEffect } from "react"
import { 
  BarChart2, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Grid, 
  AlertCircle, 
  RefreshCw, 
  Filter,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react"

import { trainerApi, WorkforceAnalyticsData } from "../../services/trainerApi"

export const WorkforceAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<WorkforceAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDept, setSelectedDept] = useState("ALL")

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getWorkforceAnalytics(selectedDept)
      setData(res)
    } catch (err: any) {
      setError(err.message || "Failed to load workforce analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [selectedDept])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-gov-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Analyzing Institutional Workforce Competencies...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <BarChart2 className="h-4 w-4" /> Institutional Capability Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Workforce Competency Analytics</h1>
          <p className="text-sm text-slate-500">Comprehensive audit of competency readiness across MoSPI statistical divisions</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 shadow-xs focus:ring-2 focus:ring-gov-blue-500"
          >
            <option value="ALL">All Divisions</option>
            <option value="Agricultural Statistics Division">Agricultural Statistics</option>
            <option value="Economic Statistics Division">Economic Statistics</option>
            <option value="Social Statistics Division">Social Statistics</option>
            <option value="Labour Statistics Division">Labour Statistics</option>
          </select>
          <button 
            onClick={fetchAnalytics}
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Section A: Overall Workforce Readiness */}
      <div className="bg-gradient-to-br from-slate-900 via-gov-blue-900 to-slate-950 text-white rounded-xl p-6 md:p-8 shadow-md border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Workforce Readiness</span>
            <div className="text-3xl md:text-4xl font-black text-white mt-1">{data?.overall_readiness_pct || 76.8}%</div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1 justify-center md:justify-start">
              <ArrowUpRight className="h-3.5 w-3.5" /> {data?.readiness_trend}
            </span>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Required Target Readiness</span>
            <div className="text-3xl md:text-4xl font-black text-slate-300 mt-1">{data?.required_readiness_pct || 85.0}%</div>
            <span className="text-xs text-slate-400 font-medium block mt-1">MoSPI Statutory Target</span>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Institutional Gap</span>
            <div className="text-3xl md:text-4xl font-black text-amber-400 mt-1">{data?.readiness_gap_pct || -8.2}%</div>
            <span className="text-xs text-amber-300 font-medium block mt-1">Requires targeted interventions</span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assessed Population</span>
            <div className="text-3xl md:text-4xl font-black text-gov-gold mt-1">248</div>
            <span className="text-xs text-slate-300 font-medium block mt-1">Statistical Officers & Analysts</span>
          </div>
        </div>
      </div>

      {/* Section B: Competency Gap Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Competency Gap Distribution</h3>
          <p className="text-xs text-slate-500">Percentage of statistical workforce below statutory proficiency threshold</p>
        </div>

        <div className="space-y-4">
          {data?.gap_distribution.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.competency_name}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-amber-700">{item.below_threshold_pct}% below threshold</span>
                  <span className="text-slate-400 text-[11px] block">Level {item.average_level} / Req {item.required_level}</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.criticality === "HIGH" ? "bg-amber-500" : "bg-gov-blue-500"}`}
                  style={{ width: `${item.below_threshold_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C & D: Department & Role Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Comparison */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gov-blue-500" /> Department Readiness Comparison
            </h3>
          </div>
          <div className="space-y-3">
            {data?.department_comparison.map((dept, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{dept.department_name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">{dept.employee_count} Employees · {dept.critical_gaps_count} Critical Gaps</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{dept.average_readiness_pct}%</div>
                  <span className="text-[10px] font-bold text-emerald-600">{dept.training_completion_pct}% completion</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Comparison */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-600" /> Role Readiness Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            {data?.role_comparison.map((role, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{role.role_name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Top Gap: <strong className="text-amber-700">{role.top_gap}</strong></span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{role.readiness_pct}%</div>
                  <span className="text-[10px] font-semibold text-slate-500">{role.employee_count} Officers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section E: Critical Gap Heatmap Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 overflow-hidden">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Grid className="h-4 w-4 text-gov-blue-500" /> Critical Gap Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">Cross-tabular evaluation of departments against core statistical competencies</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Department</th>
                <th className="p-3">Survey Sampling</th>
                <th className="p-3">Data Quality</th>
                <th className="p-3">Statistical Computing</th>
                <th className="p-3">GIS & Spatial Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {["Agricultural Statistics", "Economic Statistics", "Social Statistics", "Labour Statistics"].map((deptName, idx) => {
                const rowCells = data?.heatmap_matrix.filter(h => h.department.includes(deptName.split(" ")[0])) || []
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{deptName}</td>
                    {rowCells.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3">
                        <div className={`p-2 rounded border text-center font-bold ${
                          cell.gap < -1.0 
                            ? "bg-amber-100 text-amber-900 border-amber-300" 
                            : cell.gap < 0 
                            ? "bg-amber-50 text-amber-800 border-amber-200" 
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}>
                          <div>{cell.current_avg} / {cell.required_avg}</div>
                          <span className="text-[10px] font-extrabold block">
                            {cell.gap > 0 ? `+${cell.gap}` : cell.gap} ({cell.affected_employees} affected)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
