import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw, 
  TrendingUp, 
  Sparkles, 
  Filter, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  RefreshCw
} from "lucide-react"

import { trainerApi, TrainerDashboardData } from "../../services/trainerApi"
import { DemoJourneyModal } from "../../components/trainer/DemoJourneyModal"

export const AcademyDashboardPage: React.FC = () => {
  const [data, setData] = useState<TrainerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [timeframe, setTimeframe] = useState("30_days")
  const [selectedDepartment, setSelectedDepartment] = useState("ALL")
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const navigate = useNavigate()

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await trainerApi.getDashboard(timeframe, selectedDepartment)
      setData(res)
    } catch (err: any) {
      setError(err.message || "Failed to load Academy Dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [timeframe, selectedDepartment])

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-gov-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Workforce Intelligence Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-blue-600 via-gov-blue-500 to-gov-blue-700 rounded-xl text-white p-6 md:p-8 shadow-md border border-gov-blue-600 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gov-gold/20 text-gov-gold border border-gov-gold/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                Institutional Competency Platform
              </span>
              {data?.is_demo_dataset && (
                <span className="bg-white/10 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Demo Dataset
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Good morning, {data?.director_name || "Dr. Sunita Sharma"}
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              {data?.designation || "Senior Training Director"} · {data?.department || "NSSTA Greater Noida"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="bg-gov-gold text-gov-blue-800 hover:bg-amber-400 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 text-gov-blue-900" /> Experience VICTUS AI
            </button>
            <button
              onClick={fetchDashboard}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg border border-white/20 transition-colors"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="h-4 w-4 text-gov-blue-500" /> Filters:
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-gov-blue-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Agricultural Statistics Division">Agricultural Statistics Division</option>
            <option value="Economic Statistics Division">Economic Statistics Division</option>
            <option value="Social Statistics Division">Social Statistics Division</option>
            <option value="Labour Statistics Division">Labour Statistics Division</option>
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-gov-blue-500 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="7_days">Last 7 Days</option>
            <option value="30_days">Last 30 Days</option>
            <option value="90_days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> Updated: {data?.last_updated || "Just now"}
        </div>
      </div>

      {/* Top Section Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assessed</span>
            <Users className="h-4 w-4 text-gov-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.employees_assessed || 248}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">of {data?.total_employees || 248} total workforce</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Readiness</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.average_readiness_pct || 72.4}%</div>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> +5.6% vs target
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critical Gaps</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{data?.critical_gaps_count || 31}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">across 4 divisions</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Learning Plans</span>
            <BookOpen className="h-4 w-4 text-gov-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.active_learning_plans_count || 184}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">active interventions</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reassessments</span>
            <RotateCcw className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data?.reassessments_completed_count || 126}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">verified checkpoints</p>
        </div>

        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Gain</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">+{data?.avg_competency_gain_pct || 17.2}%</div>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">verified skill gain</p>
        </div>
      </div>

      {/* Middle Grid: Top Gaps & Recent Reassessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Workforce Gaps */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top Workforce Competency Gaps</h3>
              <p className="text-xs text-slate-500">Highest priority skill deficits requiring training intervention</p>
            </div>
            <button 
              onClick={() => navigate("/analytics/workforce")}
              className="text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800 flex items-center gap-1"
            >
              Full Analytics <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {data?.top_workforce_gaps.map((gap, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{gap.competency}</span>
                  <span className="text-amber-700 font-bold">{gap.gap_pct}% workforce gap</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${gap.criticality === "HIGH" ? "bg-amber-500" : "bg-gov-blue-500"}`}
                    style={{ width: `${gap.gap_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reassessments Competency Improvement */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Competency Improvements</h3>
              <p className="text-xs text-slate-500">Verified post-training reassessment score increases</p>
            </div>
            <button 
              onClick={() => navigate("/training-effectiveness")}
              className="text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800 flex items-center gap-1"
            >
              Training Impact <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {data?.recent_reassessments.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.employee}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.competency}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-slate-600">
                    {item.before}% → <strong className="text-slate-900">{item.after}%</strong>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-md">
                    {item.gain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Journey Modal */}
      <DemoJourneyModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
