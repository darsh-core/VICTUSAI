import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShieldCheck, BarChart2, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"

import { trainerApi } from "../../services/trainerApi"

export const AssessmentAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getAssessmentAnalytics(id || "default")
      setData(res)
    } catch (err: any) {
      setError(err.message || "Failed to load assessment analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [id])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-gov-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Computing Assessment Analytics & Item Performance...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Assessment Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-bold text-gov-blue-800 bg-gov-blue-100 px-2.5 py-0.5 rounded-full uppercase">
            Assessment Analytics · {data?.target_role || "Statistical Officer"}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{data?.title || "Sampling Methodology Core Assessment"}</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Empirical response analysis across {data?.participants_count || 24} test participants
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Participants</span>
            <div className="text-xl font-black text-slate-900">{data?.participants_count || 24}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Completion</span>
            <div className="text-xl font-black text-slate-900">{data?.completion_rate_pct || 92.5}%</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Avg Score</span>
            <div className="text-xl font-black text-emerald-700">{data?.average_score_pct || 71.4}%</div>
          </div>
        </div>
      </div>

      {/* Competency Performance Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Competency Performance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.competency_breakdown.map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900">{item.competency}</span>
                <span className="text-gov-blue-600">{item.score_pct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.score_pct >= 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${item.score_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Item Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Question Difficulty & Error Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Question Statement</th>
                <th className="p-3">Competency</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Accuracy %</th>
                <th className="p-3 text-right">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {data?.question_performances.map((q: any) => (
                <tr key={q.question_id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 max-w-md truncate">{q.text}</td>
                  <td className="p-3 text-slate-600">{q.competency_name}</td>
                  <td className="p-3 text-slate-600">{q.difficulty}</td>
                  <td className="p-3">
                    <span className={`font-black ${q.correct_pct < 50 ? "text-rose-600" : "text-emerald-700"}`}>
                      {q.correct_pct}% correct
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {q.needs_review ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertCircle className="h-3 w-3" /> Flagged for Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Verified Item
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
