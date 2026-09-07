import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Users, ChevronRight, Award, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react"

import { trainerApi, EmployeeListItem } from "../../services/trainerApi"

export const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  const navigate = useNavigate()

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getEmployees(searchQuery, selectedDept, undefined, selectedStatus)
      setEmployees(res)
    } catch (err: any) {
      setError(err.message || "Failed to fetch employee workforce directory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [searchQuery, selectedDept, selectedStatus])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <Users className="h-4 w-4" /> Official Statistical Workforce Directory
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Workforce Employee Profiles</h1>
          <p className="text-sm text-slate-500">Inspect individual employee readiness, competency gaps, and active learning plans</p>
        </div>

        <button 
          onClick={fetchEmployees}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Directory
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Employee Name, ID, or Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-gov-blue-500 focus:outline-none"
            />
          </div>
        </div>

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
            <option value="ALL">All Learning Statuses</option>
            <option value="Active">Active Plan</option>
            <option value="Completed">Completed</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Employee List Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <RefreshCw className="h-7 w-7 text-gov-blue-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Fetching employee records...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No workforce employees found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or department filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Role & Designation</th>
                  <th className="p-4">Department & Domain</th>
                  <th className="p-4">Readiness</th>
                  <th className="p-4">Critical Gaps</th>
                  <th className="p-4">Plan Status</th>
                  <th className="p-4">Last Assessed</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {employees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gov-blue-100 text-gov-blue-800 font-bold flex items-center justify-center shrink-0 border border-gov-blue-200">
                          {emp.avatar_initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{emp.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{emp.employee_code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{emp.role_name}</div>
                      <span className="text-[11px] text-slate-500">{emp.email}</span>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{emp.department}</div>
                      <span className="text-[10px] text-slate-400">{emp.domain}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{emp.overall_readiness_pct}%</span>
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${emp.overall_readiness_pct >= 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${emp.overall_readiness_pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {emp.critical_gaps_count > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="h-3 w-3" /> {emp.critical_gaps_count} Critical
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> Optimal
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.learning_plan_status === "Active" 
                          ? "bg-gov-blue-100 text-gov-blue-800" 
                          : emp.learning_plan_status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {emp.learning_plan_status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 text-[11px]">
                      {emp.last_assessed_at || "Recent"}
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/employees/${emp.id}`)
                        }}
                        className="text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800 inline-flex items-center gap-0.5 hover:underline"
                      >
                        Competency Twin <ChevronRight className="h-4 w-4" />
                      </button>
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
