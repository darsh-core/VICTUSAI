import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Award, 
  FileText, 
  ShieldCheck,
  BookOpen,
  ArrowRight
} from "lucide-react"

interface DemoJourneyModalProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  {
    step: 1,
    title: "1. Workforce Competency Analytics",
    route: "/analytics/workforce",
    icon: Users,
    tagline: "WHAT competency gaps exist in my workforce?",
    description: "Inspect overall workforce readiness (76.8%) across NSSO and MoSPI divisions. Identify 'Survey Sampling' and 'Data Quality' as the highest priority critical gaps impacting Agricultural & Economic Statistics.",
    highlight: "Workforce Gap Heatmap Matrix"
  },
  {
    step: 2,
    title: "2. Employee Competency Twin",
    route: "/employees",
    icon: Award,
    tagline: "WHO has those gaps & WHY do they matter?",
    description: "Search for Statistical Officer 'Arun Kumar'. View his AI Competency Twin showing level 2.3 vs required level 3.5 in Survey Sampling (-24% gap), backed by assessment evidence.",
    highlight: "AI Competency Twin & Evidence Breakdown"
  },
  {
    step: 3,
    title: "3. Explainable AI Recommendations",
    route: "/recommendations",
    icon: BookOpen,
    tagline: "WHAT learning intervention should I provide?",
    description: "View iGOT Karmayogi & NSSTA recommended learning resources tailored for Arun Kumar. Expand 'Why this recommendation?' to inspect transparent AI decision factors.",
    highlight: "Explainable AI & Demo iGOT Integration"
  },
  {
    step: 4,
    title: "4. Document Intelligence & RAG Question Review",
    route: "/questions/review",
    icon: FileText,
    tagline: "CREATE source-grounded assessments",
    description: "Process official statistical manuals ('Agricultural Statistics Methodology.pdf'). Review RAG-generated MCQs with 384-D vector embeddings, grounding scores (0.88), and page citations.",
    highlight: "AI Question Review & Quality Gate"
  },
  {
    step: 5,
    title: "5. Training Effectiveness & Before vs After Gain",
    route: "/training-effectiveness",
    icon: TrendingUp,
    tagline: "DID competency actually improve?",
    description: "Measure verified competency gain (+22% in Survey Sampling, 61% → 83%) after post-training reassessment. Verify institutional capability improvement.",
    highlight: "Before vs After Competency Movement"
  }
]

export const DemoJourneyModal: React.FC<DemoJourneyModalProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const navigate = useNavigate()

  if (!isOpen) return null

  const currentStep = STEPS[currentStepIndex]
  const Icon = currentStep.icon

  const handleNavigateToStep = () => {
    navigate(currentStep.route)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gov-blue-500 text-white p-6 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gov-gold/20 flex items-center justify-center text-gov-gold border border-gov-gold/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gov-gold uppercase tracking-widest block">SIH 2026 Presentation Mode</span>
              <h2 className="text-lg font-bold text-white">Experience VICTUS AI Skill Intelligence</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600 font-semibold">
          <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
          <div className="flex gap-1.5">
            {STEPS.map((s, idx) => (
              <div 
                key={s.step} 
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx === currentStepIndex 
                    ? "w-8 bg-gov-blue-500" 
                    : idx < currentStepIndex 
                    ? "w-4 bg-emerald-500" 
                    : "w-4 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6">
          <div className="flex items-start gap-4 bg-gov-blue-50/50 p-4 rounded-lg border border-gov-blue-100">
            <div className="p-3 rounded-lg bg-gov-blue-500 text-white shrink-0 shadow-xs">
              <Icon className="h-6 w-6 text-gov-gold" />
            </div>
            <div>
              <span className="text-xs font-bold text-gov-blue-600 uppercase tracking-wider">{currentStep.tagline}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentStep.title}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Key Demo Feature: <strong className="text-slate-900">{currentStep.highlight}</strong></span>
            </div>
            <button 
              onClick={handleNavigateToStep}
              className="text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800 flex items-center gap-1 hover:underline shrink-0"
            >
              Go to Screen <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(prev => prev - 1)}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded-md hover:bg-slate-200/50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <button
            onClick={handleNavigateToStep}
            className="bg-gov-gold text-gov-blue-800 hover:bg-amber-400 text-xs font-bold px-4 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            Explore Screen <ArrowRight className="h-4 w-4" />
          </button>

          <button
            disabled={currentStepIndex === STEPS.length - 1}
            onClick={() => setCurrentStepIndex(prev => prev + 1)}
            className="flex items-center gap-1 text-xs font-bold text-gov-blue-600 hover:text-gov-blue-800 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded-md hover:bg-gov-blue-50"
          >
            Next Step <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
