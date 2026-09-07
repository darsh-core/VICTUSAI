import React, { useState, useEffect } from "react"
import { FileText, Download, Eye, RefreshCw, CheckCircle2 } from "lucide-react"

import { trainerApi, TrainerReportItem } from "../../services/trainerApi"

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<TrainerReportItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getReports()
      setReports(res)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDownload = (reportTitle: string, format: string) => {
    alert(`Downloading '${reportTitle}' in ${format} format...`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <FileText className="h-4 w-4" /> Institutional Reporting & Audit Exports
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Workforce Intelligence Reports</h1>
          <p className="text-sm text-slate-500">Download official PDF & CSV competency reports for MoSPI executive leadership</p>
        </div>

        <button 
          onClick={fetchReports}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Reports
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div key={rep.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gov-blue-800 bg-gov-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                  {rep.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">{rep.title}</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{rep.generated_at}</span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {rep.description}
            </p>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-500 font-bold">{rep.record_count} Records Audited</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(rep.title, "PDF")}
                  className="bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
                <button
                  onClick={() => handleDownload(rep.title, "CSV")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-md border border-slate-300 transition-colors flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
