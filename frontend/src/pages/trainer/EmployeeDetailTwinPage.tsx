import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  User, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  RotateCcw, 
  FileText, 
  Sparkles, 
  RefreshCw 
} from "lucide-react"

import { trainerApi, EmployeeDetailData } from "../../services/trainerApi"

export const EmployeeDetailTwinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [data, setData] = useState<EmployeeDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string | null>(null)

  const fetchTwin = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await trainerApi.getEmployeeDetail(id)
      setData(res)
      if (res.competency_twin.length > 0) {
        setSelectedCompetencyId(res.competency_twin[0].competency_id)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load employee competency twin")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTwin()
  }, [id])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-gov-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Generating AI Competency Twin...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-base">Error Loading Employee Profile</h3>
        <p className="text-xs">{error || "Employee record not found"}</p>
        <button onClick={() => navigate("/employees")} className="text-xs font-bold text-gov-blue-600 underline">
          Back to Employee Directory
        </button>
      </div>
    )
  }

  const activeRow = data.competency_twin.find(c => c.competency_id === selectedCompetencyId) || data.competency_twin[0]

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <button 
        onClick={() => navigate("/employees")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Employee Directory
      </button>

      {/* Header Profile Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gov-blue-500 text-white text-xl font-bold flex items-center justify-center shrink-0 border-2 border-gov-gold shadow-sm">
            {data.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gov-blue-100 text-gov-blue-800">
                {data.employee_code}
              </span>
              <span className="text-xs text-slate-400 font-mono">{data.email}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{data.name}</h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {data.role_name} · {data.department} ({data.domain})
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Overall Readiness Score</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{data.overall_readiness_pct}%</div>
          <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mt-1 ${
            data.overall_readiness_pct >= 75 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}>
            {data.readiness_status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Section: AI Competency Twin */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
              <Sparkles className="h-4 w-4 text-gov-gold" /> AI Competency Twin
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Workforce Competency Mapping</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{data.competency_twin.length} Evaluated Dimensions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Competency</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current</th>
                <th className="p-3">Required Target</th>
                <th className="p-3">Gap</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Inspect Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {data.competency_twin.map((row) => {
                const isSelected = row.competency_id === activeRow?.competency_id
                return (
                  <tr 
                    key={row.competency_id} 
                    onClick={() => setSelectedCompetencyId(row.competency_id)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-gov-blue-50/70 border-l-4 border-l-gov-blue-500" : "hover:bg-slate-50"}`}
                  >
                    <td className="p-3 font-bold text-slate-900">{row.competency_name}</td>
                    <td className="p-3 text-slate-600">{row.category}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{row.current_level.toFixed(1)} / 5.0</td>
                    <td className="p-3 font-mono text-slate-600">{row.required_level.toFixed(1)} / 5.0</td>
                    <td className="p-3">
                      <span className={`font-extrabold ${row.gap_pct < 0 ? "text-amber-700" : "text-emerald-700"}`}>
                        {row.gap_pct > 0 ? `+${row.gap_pct}%` : `${row.gap_pct}%`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        row.status === "Critical" 
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : row.status === "Attention"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[11px] font-bold text-gov-blue-600 hover:underline">
                        View Reasoning
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Competency Reasoning Card */}
        {activeRow && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gov-blue-500" /> AI Reasoning for '{activeRow.competency_name}'
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {activeRow.status} Priority Gap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block text-slate-400">
                  Why is this a gap?
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {activeRow.why_is_this_a_gap}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block text-slate-400">
                  Why important for role?
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {activeRow.why_important_for_role}
                </p>
              </div>

              <div className="bg-gov-blue-50/50 p-4 rounded-lg border border-gov-blue-200 space-y-1">
                <span className="font-bold text-gov-blue-800 uppercase tracking-wider text-[10px] block">
                  Recommended Intervention
                </span>
                <p className="text-gov-blue-900 leading-relaxed font-semibold">
                  {activeRow.recommended_intervention}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section: Evidence History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-gov-blue-500" /> Empirical Assessment & Training Evidence
          </h3>
          <p className="text-xs text-slate-500">Verified diagnostic scores, completed learning modules, and reassessment checkpoints</p>
        </div>

        <div className="space-y-3">
          {data.evidence_history.map((ev) => (
            <div key={ev.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {ev.evidence_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{ev.details}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-gov-blue-600">{ev.score_or_status}</div>
                <span className="text-[10px] text-slate-400">{ev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
