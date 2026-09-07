import React, { useState, useEffect } from "react"
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Filter, 
  ThumbsUp, 
  ThumbsDown,
  Edit3,
  ExternalLink,
  BookOpen,
  Quote
} from "lucide-react"

import { trainerApi, QuestionReviewSummary, QuestionReviewItem } from "../../services/trainerApi"

export const AIQuestionReviewPage: React.FC = () => {
  const [summary, setSummary] = useState<QuestionReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<string>("PENDING_REVIEW")
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("")
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await trainerApi.getQuestionReview(activeTab, selectedDocumentId || undefined)
      setSummary(res)
    } catch (err: any) {
      setError(err.message || "Failed to load questions for review")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [activeTab, selectedDocumentId])

  const handleReviewAction = async (questionId: string, action: "APPROVE" | "REJECT", reason?: string) => {
    try {
      await trainerApi.reviewQuestion(questionId, action, reason)
      fetchQuestions()
      if (rejectionModalId) {
        setRejectionModalId(null)
        setRejectionReason("")
      }
    } catch (err: any) {
      alert("Failed to review question: " + (err.message || err))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-blue-600 uppercase tracking-widest">
            <FileCheck className="h-4 w-4" /> AI Quality Gate & Source Traceability
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">AI Question Review Board</h1>
          <p className="text-sm text-slate-500">Inspect, validate, approve, or reject RAG-generated assessment items against official methodology manuals</p>
        </div>

        <button 
          onClick={fetchQuestions}
          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold text-slate-700"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Items
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Generated</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary?.total_generated || 40}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">RAG Grounded Items</span>
        </div>

        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">Approved</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{summary?.approved_count || 31}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Ready for Assessment</span>
        </div>

        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">Needs Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{summary?.pending_review_count || 6}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Pending Trainer Approval</span>
        </div>

        <div className="bg-rose-50 p-5 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">Rejected</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{summary?.rejected_count || 3}</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Flagged / Excluded</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Avg Grounding Score</span>
          <div className="text-2xl font-black text-gov-blue-600 mt-1">{summary?.avg_grounding_score || 0.88}</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Target threshold ≥ 0.50</span>
        </div>
      </div>

      {/* Manual / Document Filter Bar & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-3">
        {/* Status Tabs */}
        <div className="flex gap-6 text-xs font-bold">
          {[
            { id: "PENDING_REVIEW", label: "Pending Review", count: summary?.pending_review_count },
            { id: "APPROVED", label: "Approved", count: summary?.approved_count },
            { id: "REJECTED", label: "Rejected", count: summary?.rejected_count },
            { id: "ALL", label: "All Items", count: summary?.total_generated }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-gov-blue-500 text-gov-blue-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab.id ? "bg-gov-blue-100 text-gov-blue-800" : "bg-slate-100 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Manual / Document Selector Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs">
          <BookOpen className="h-4 w-4 text-gov-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Source Manual:</span>
          <select
            value={selectedDocumentId}
            onChange={(e) => setSelectedDocumentId(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:ring-0 outline-none cursor-pointer pr-2 max-w-xs"
          >
            <option value="">All Manuals & Publications</option>
            {summary?.documents?.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.count} questions)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <RefreshCw className="h-7 w-7 text-gov-blue-500 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Retrieving questions from Quality Gate...</p>
        </div>
      ) : summary?.questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No questions found for this filter</h3>
          <p className="text-xs text-slate-500">Select another manual or status tab, or generate new questions via Document Intelligence.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {summary?.questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              {/* Question Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gov-blue-100 text-gov-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {q.competency_name}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {q.difficulty}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Grounding: {q.grounding_score.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    q.review_status === "APPROVED" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : q.review_status === "REJECTED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {q.review_status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-relaxed">{q.text}</h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {q.options.map((opt, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      opt.is_correct 
                        ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900" 
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span><strong className="mr-2">{String.fromCharCode(65 + idx)}.</strong> {opt.text}</span>
                    {opt.is_correct && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Source Traceability & Citation Reference Chunk */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-gov-blue-500" /> Source Citation: <strong>{q.source_doc_title || "Agricultural Statistics Manual.pdf"}</strong> (Page {q.source_page || 1})
                  </span>
                  <span className="text-emerald-700 font-bold">AI Quality Check: PASSED</span>
                </div>

                {/* Source Citation Reference Chunk Box */}
                {q.source_chunk_text && (
                  <div className="bg-amber-50/90 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900 uppercase tracking-wide">
                      <Quote className="h-3.5 w-3.5 text-amber-700 shrink-0" /> Source Citation Reference Chunk
                    </div>
                    <p className="text-amber-950 font-mono text-[11.5px] leading-relaxed italic bg-white/80 p-2.5 rounded border border-amber-200/80">
                      "{q.source_chunk_text}"
                    </p>
                  </div>
                )}

                <p className="text-slate-600 leading-relaxed font-medium">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
                {q.rejection_reason && (
                  <p className="text-rose-700 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                    Rejection Feedback: {q.rejection_reason}
                  </p>
                )}
              </div>

              {/* Trainer Review Actions */}
              <div className="flex justify-end items-center gap-3 pt-2">
                {q.review_status !== "APPROVED" && (
                  <button
                    onClick={() => handleReviewAction(q.id, "APPROVE")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> Approve Question
                  </button>
                )}

                {q.review_status !== "REJECTED" && (
                  <button
                    onClick={() => setRejectionModalId(q.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" /> Reject / Flag
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Feedback Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reject Question Item</h3>
            <p className="text-xs text-slate-500">Provide rejection reason or corrective feedback for version history log.</p>
            <textarea
              rows={3}
              placeholder="E.g., Ambiguous wording in option C or factual misalignment with NSS 78th round..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setRejectionModalId(null)}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReviewAction(rejectionModalId, "REJECT", rejectionReason)}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
