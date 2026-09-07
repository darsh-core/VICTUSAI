import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, AlertTriangle, CheckCircle2, Clock, ArrowRight, RefreshCw } from "lucide-react"

import { trainerApi, TrainerAlertItem } from "../../services/trainerApi"

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<TrainerAlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getAlerts()
      setAlerts(res)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <Bell className="h-4 w-4" /> Institutional Alerts & Notification Center
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Trainer Priority Alerts</h1>
          <p className="text-sm text-slate-500">Critical competency gap spikes, inactive learning plans, and question review notifications</p>
        </div>

        <button 
          onClick={fetchAlerts}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Alerts
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alt) => (
          <div 
            key={alt.id}
            className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
              alt.severity === "HIGH" 
                ? "bg-amber-50/60 border-amber-200" 
                : alt.severity === "MEDIUM"
                ? "bg-slate-50 border-slate-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg shrink-0 ${
                alt.severity === "HIGH" ? "bg-amber-500 text-white" : "bg-gov-blue-500 text-white"
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{alt.title}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    alt.severity === "HIGH" ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-700"
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">{alt.message}</p>
              </div>
            </div>

            {alt.action_link && (
              <button
                onClick={() => navigate(alt.action_link!)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg shadow-xs shrink-0 flex items-center gap-1"
              >
                Take Action <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
