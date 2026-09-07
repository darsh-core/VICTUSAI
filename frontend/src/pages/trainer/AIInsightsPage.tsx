import React, { useState, useEffect } from "react"
import { Sparkles, AlertCircle, TrendingUp, ShieldAlert, ArrowUpRight, Compass, RefreshCw, Terminal, Activity, CheckCircle2, Clock } from "lucide-react"

import { trainerApi, AIInsightItem, FutureSkillItem, AILogItem } from "../../services/trainerApi"

export const AIInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<AIInsightItem[]>([])
  const [futureSkills, setFutureSkills] = useState<FutureSkillItem[]>([])
  const [logs, setLogs] = useState<AILogItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [insRes, futRes, logsRes] = await Promise.all([
        trainerApi.getAIInsights(),
        trainerApi.getFutureSkills(),
        trainerApi.getAILogs()
      ])
      setInsights(insRes)
      setFutureSkills(futRes)
      setLogs(logsRes)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-gov-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Generating AI Insights & Scanning Future Capability Signals...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-gov-gold" /> Institutional AI Intelligence & Future Radar
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">AI Insights & Future Skill Signals</h1>
          <p className="text-sm text-slate-500">Evidence-based AI insights generated from real backend aggregate workforce telemetry & RAG audit trail</p>
        </div>

        <button 
          onClick={fetchData}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Insights
        </button>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gov-gold" /> Active Workforce AI Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((ins) => (
            <div key={ins.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    ins.category === "Gap" 
                      ? "bg-amber-100 text-amber-900" 
                      : ins.category === "High Gain"
                      ? "bg-emerald-100 text-emerald-900"
                      : ins.category === "Risk"
                      ? "bg-rose-100 text-rose-900"
                      : "bg-gov-blue-100 text-gov-blue-900"
                  }`}>
                    {ins.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{ins.metric}</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  ins.priority === "HIGH" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {ins.priority} PRIORITY
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{ins.title}</h3>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                <div>
                  <strong className="text-slate-700 text-[11px] block">Empirical Evidence:</strong>
                  <p className="text-slate-600 font-medium">{ins.evidence}</p>
                </div>
                <div>
                  <strong className="text-slate-700 text-[11px] block">Affected Population:</strong>
                  <p className="text-slate-600 font-semibold">{ins.affected_population}</p>
                </div>
              </div>

              <div className="bg-gov-blue-50/70 p-3.5 rounded-lg border border-gov-blue-200 text-xs space-y-1">
                <span className="font-bold text-gov-blue-800 text-[11px] block">Recommended Action:</span>
                <p className="text-gov-blue-900 font-semibold">{ins.recommended_action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Skills Radar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
              <Compass className="h-4 w-4" /> Emerging Skill Signals
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Future Skills Radar for Official Statistics</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">MoSPI Modernization Roadmap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {futureSkills.map((fs, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-gov-blue-100 text-gov-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  {fs.domain}
                </span>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {fs.priority}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{fs.skill_name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{fs.description}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Readiness: {fs.current_workforce_readiness_pct}%</span>
                  <span className="text-gov-blue-600">Target: {fs.target_future_readiness_pct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gov-blue-500 h-full rounded-full" style={{ width: `${fs.current_workforce_readiness_pct}%` }} />
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 text-[11px] block">Target Pathway:</span>
                <p className="text-gov-blue-800 font-semibold mt-0.5">{fs.recommended_pathway}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Execution Logs & RAG / Copilot Audit Trail Panel */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-extrabold text-white">AI Execution Logs & RAG / Copilot Audit Trail</h2>
              <p className="text-xs text-slate-400">Step-by-step vector search, LLM prompts, quality gate checks, and copilot execution telemetry</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono bg-slate-800 px-3 py-1 rounded text-emerald-400 border border-slate-700">
            <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Component</th>
                <th className="py-2 px-3">Action / Operation</th>
                <th className="py-2 px-3">Trace Details</th>
                <th className="py-2 px-3 text-right">Latency</th>
                <th className="py-2 px-3 text-right">Grounding</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-gov-gold border border-slate-700">
                      {log.component}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{log.latency_ms} ms</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    {log.grounding_score !== undefined ? `${Math.round(log.grounding_score * 100)}%` : "N/A"}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "SUCCESS" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {log.status}
                    </span>
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

