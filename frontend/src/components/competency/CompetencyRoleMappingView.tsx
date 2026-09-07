import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FileText, 
  Award, 
  Users, 
  Sparkles, 
  Layers, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Filter, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "../ui/Primitives"

interface RoleMappingItem {
  roleName: string;
  roleCode: string;
  competencies: string[];
  manuals: string[];
  mcqFocus: string;
  description: string;
}

const MATRIX_DATA: RoleMappingItem[] = [
  {
    roleName: "Statistical Officer",
    roleCode: "ROLE_STAT_OFFICER",
    competencies: [
      "STAT_SURVEY_DESIGN - Survey Design",
      "STAT_SAMPLING - Sampling Methodology",
      "STAT_QUALITY - Data Quality",
      "BEH_ETHICS - Ethics"
    ],
    manuals: [
      "NSSO Survey Methodology Handbook.pdf",
      "MoSPI Data Quality Guidelines.pdf"
    ],
    mcqFocus: "Sampling error estimation, stratifying survey units, official data collection protocols, field auditing procedures.",
    description: "Responsible for executing official statistical surveys, field data verification, and enforcing sampling standards."
  },
  {
    roleName: "Data Analyst",
    roleCode: "ROLE_DATA_ANALYST",
    competencies: [
      "TECH_PYTHON - Python",
      "TECH_SQL - SQL",
      "TECH_VISUALIZATION - Data Visualization",
      "STAT_PRICES - Price Statistics",
      "GOV_OPEN_DATA - Open Data"
    ],
    manuals: [
      "Statistical Computing Manual.pdf",
      "National Data Sharing Policy.pdf"
    ],
    mcqFocus: "SQL aggregation queries, CPI/WPI index calculation, dashboard visualization, vector data processing.",
    description: "Transforms raw statistical survey datasets into actionable insights, dashboards, and official publications."
  },
  {
    roleName: "Survey Methodologist",
    roleCode: "ROLE_SURVEY_METHODOLOGIST",
    competencies: [
      "STAT_SURVEY_DESIGN - Survey Design",
      "STAT_SAMPLING - Sampling Methodology",
      "STAT_METADATA - Metadata Standards",
      "TECH_R - R"
    ],
    manuals: [
      "Advanced Survey Design & Sampling Manual.pdf",
      "Statistical Metadata ISO 11179 Guide.pdf"
    ],
    mcqFocus: "Multistage cluster sampling, non-response weight adjustment, frame selection, variance estimation in R.",
    description: "Designs national survey frames, sampling methodologies, estimation formulas, and metadata schemas."
  },
  {
    roleName: "Statistical Data Engineer",
    roleCode: "ROLE_DATA_ENGINEER",
    competencies: [
      "TECH_SQL - SQL",
      "TECH_CLOUD - Cloud Computing",
      "TECH_API - API Integration",
      "TECH_AI_ML - AI/ML",
      "GOV_CYBERSECURITY - Cybersecurity"
    ],
    manuals: [
      "MoSPI Cloud & Data Pipeline Manual.pdf",
      "Government Cybersecurity Guidelines.pdf"
    ],
    mcqFocus: "ETL pipeline optimization, API rate limiting, vector index querying in pgvector, data encryption at rest.",
    description: "Architects scalable statistical databases, automated ETL pipelines, pgvector indices, and secure API gateways."
  },
  {
    roleName: "Statistical Supervisor",
    roleCode: "ROLE_STAT_SUPERVISOR",
    competencies: [
      "STAT_QUALITY - Data Quality",
      "BEH_LEADERSHIP - Leadership",
      "BEH_PROJ_MGMT - Project Management",
      "BEH_COMMUNICATION - Communication"
    ],
    manuals: [
      "Field Inspection & Quality Supervision Handbook.pdf",
      "Public Sector Leadership Manual.pdf"
    ],
    mcqFocus: "Field survey auditing, team resource allocation, non-sampling error detection, conflict resolution.",
    description: "Supervises field operations, leads enumerator teams, ensures data collection accuracy, and audits returns."
  },
  {
    roleName: "Official Statistics Manager",
    roleCode: "ROLE_STAT_MANAGER",
    competencies: [
      "STAT_NAT_ACCOUNTS - National Accounts",
      "STAT_SDG - SDG Indicators",
      "BEH_DECISION - Decision Making",
      "BEH_CHANGE_MGMT - Change Management",
      "GOV_DPI - Digital Public Infrastructure"
    ],
    manuals: [
      "National Accounts Statistics Manual.pdf",
      "India SDG National Indicator Framework.pdf"
    ],
    mcqFocus: "GDP deflator computation, SDG indicator tracking, executive policy decisions, digital transformation roadmap.",
    description: "Manages national statistical releases, oversees SDG indicator reporting, and guides strategic policy decisions."
  }
];

export const CompetencyRoleMappingView = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredMatrix = MATRIX_DATA.filter((item) => {
    const matchesRole = selectedRole === "ALL" || item.roleCode === selectedRole;
    const matchesSearch = 
      item.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.competencies.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.manuals.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.mcqFocus.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B192C] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Architecture & Mapping Matrix</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
            Competency & Role Mapping Architecture
          </h1>
          <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium">
            This interactive architecture specifies how <strong className="text-white font-bold">VICTUS AI</strong> maps official government training manuals and RAG-generated MCQs directly to <strong className="text-white font-bold">Target Competencies</strong> and <strong className="text-white font-bold">iGOT Karmayogi Job Roles</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-900/90 text-blue-200 border border-blue-600 shadow-xs">
              pgvector RAG Grounded
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-900/90 text-amber-200 border border-amber-600 shadow-xs">
              6 Core Government Roles
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-900/90 text-emerald-200 border border-emerald-600 shadow-xs">
              28 Target Competencies
            </span>
          </div>
        </div>
      </div>


      {/* 1. End-to-End System Mapping Flow */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <CardTitle className="text-sm font-bold text-gov-blue-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-gov-blue-600" />
            <span>1. End-to-End System Mapping Flow</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
            {/* Stage 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-gov-blue-700 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-gov-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Input</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">Official Government Manual</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">PDF / DOCX Upload (up to 30MB)</p>
            </div>

            {/* Stage 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Indexing</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">pgvector Semantic Chunking</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">384D Embeddings & Chunking</p>
            </div>

            {/* Stage 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tagging</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">Target Competency Tagging</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">Mapped to 28 Competencies</p>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Generation</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">RAG MCQ Generator</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">Ollama / Groq LLM Grounded</p>
            </div>

            {/* Stage 5 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Audit</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">AI Question Review Board</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">Evaluator Approval & Citations</p>
            </div>

            {/* Stage 6 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center relative group hover:border-gov-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-gov-blue-700 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-gov-blue-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Elevation</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">Competency Twin Radar</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">Role Readiness Elevation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. The 3-Tier Relational Data Model */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <CardTitle className="text-sm font-bold text-gov-blue-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-gov-blue-600" />
            <span>2. The 3-Tier Relational Data Model</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-inner font-mono text-xs overflow-x-auto border border-slate-800">
            <pre className="text-amber-300 font-bold leading-relaxed">
{`[ Manual / Document ]
       │
       │ (1 to Many: Semantic Chunks & pgvector Embeddings)
       ▼
[ Grounded MCQs ] ───────(QuestionCompetency)───────► [ Target Competency ]
                                                            │
                                                            │ (RoleCompetency Requirement)
                                                            ▼
                                                      [ Job Role ]`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-gov-blue-900 font-bold text-xs">
                <Badge variant="info">Tier 1</Badge>
                <span>Manual &rarr; MCQ Grounding</span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-700">source_doc_id, source_chunk_id</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every MCQ retains the exact ID, page number, and source text of the chunk from which it was generated. Ensures 100% verifiable source citation and zero hallucination.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-gov-blue-900 font-bold text-xs">
                <Badge variant="warning">Tier 2</Badge>
                <span>MCQ &rarr; Competency</span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-700">QuestionCompetency (Level 1–5)</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Links each MCQ to a specific Target Competency Code (e.g., <code className="bg-slate-200 px-1 rounded">STAT_SAMPLING</code>, <code className="bg-slate-200 px-1 rounded">TECH_PYTHON</code>, <code className="bg-slate-200 px-1 rounded">GOV_DPI</code>). Specifies difficulty level.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-gov-blue-900 font-bold text-xs">
                <Badge variant="success">Tier 3</Badge>
                <span>Competency &rarr; Job Role</span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-700">RoleCompetency Requirement</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maps each Job Role (e.g., <code className="bg-slate-200 px-1 rounded">ROLE_DATA_ANALYST</code>) to its required competency portfolio and expected target proficiency levels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Comprehensive Role-Competency-Manual Mapping Matrix */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-gov-blue-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-gov-blue-600" />
              <span>3. Comprehensive Role-Competency-Manual Mapping Matrix</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative mapping matrix linking official MoSPI roles to target competencies, manuals, and MCQ grounding focus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Government Roles</option>
                {MATRIX_DATA.map((item) => (
                  <option key={item.roleCode} value={item.roleCode}>
                    {item.roleName} ({item.roleCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search competency, manual..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-gov-blue-500 w-48 md:w-56"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 w-1/5">Job Role (from Dropdown)</th>
                <th className="p-4 w-1/4">Primary Target Competencies</th>
                <th className="p-4 w-1/4">Recommended Manuals</th>
                <th className="p-4 w-3/12">Sample Generated MCQ Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMatrix.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                    No matching roles or competencies found for your query.
                  </td>
                </tr>
              ) : (
                filteredMatrix.map((item) => (
                  <tr key={item.roleCode} className="hover:bg-slate-50/80 transition-colors">
                    {/* Job Role */}
                    <td className="p-4 align-top">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 text-sm block">{item.roleName}</span>
                        <code className="text-[10px] font-mono text-gov-blue-700 bg-gov-blue-50 border border-gov-blue-200 px-1.5 py-0.5 rounded inline-block">
                          {item.roleCode}
                        </code>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.description}</p>
                      </div>
                    </td>

                    {/* Primary Target Competencies */}
                    <td className="p-4 align-top">
                      <div className="space-y-1.5">
                        {item.competencies.map((comp, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gov-blue-600 shrink-0" />
                            <span className="font-semibold text-slate-800 text-xs">{comp}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Recommended Manuals */}
                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        {item.manuals.map((manual, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-50 border border-slate-200/80">
                            <BookOpen className="w-3.5 h-3.5 text-gov-blue-600 shrink-0 mt-0.5" />
                            <span className="font-medium text-slate-700 text-xs leading-tight">{manual}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Sample Generated MCQ Focus */}
                    <td className="p-4 align-top">
                      <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Grounded Focus</span>
                        <p className="text-slate-800 leading-relaxed text-xs">{item.mcqFocus}</p>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate("/documents")}
                          className="mt-2 text-[10px] py-1 h-6 gap-1 font-bold text-gov-blue-700"
                        >
                          <span>Generate Questions</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. How Generated MCQs Drive the Learner Journey */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <CardTitle className="text-sm font-bold text-gov-blue-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>4. How Generated MCQs Drive the Learner Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-gov-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <Badge variant="info">Upload & Target</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Upload Manual & Target Competency</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainer uploads <code className="bg-slate-100 px-1 rounded">National Accounts Handbook.pdf</code>, selects Target Competency <code className="bg-slate-100 px-1 rounded">STAT_NAT_ACCOUNTS</code>, and clicks <strong>Generate Questions</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-gov-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <Badge variant="warning">RAG MCQ</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Grounded MCQ Generation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                System retrieves vector chunks from <code className="bg-slate-100 px-1 rounded">National Accounts Handbook.pdf</code>. LLM generates 5 MCQs tagged with <code className="bg-slate-100 px-1 rounded">STAT_NAT_ACCOUNTS</code> and Difficulty Level 3.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-gov-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <Badge variant="success">Review Board</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Approval in AI Review Board</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Question review board displays questions grouped by manual with exact chunk citation previews. Evaluator approves questions for official assessment.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-gov-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <Badge variant="outline" className="border-amber-400 text-amber-800 bg-amber-50">Twin Elevation</Badge>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Dynamic Assessment & Elevation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learner with role <code className="bg-slate-100 px-1 rounded">ROLE_STAT_MANAGER</code> completes assessment. Answers increase verified score, expanding the <strong>Competency Twin Radar</strong> in real time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
