import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  ShieldCheck,
  Award,
  AlertCircle,
  UserCheck,
  BrainCircuit,
  FileCheck
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { roleApi } from "../services/roleApi";
import { userApi } from "../services/userApi";
import { metaApi, Department, Domain } from "../services/metaApi";
import { assessmentApi } from "../services/assessmentApi";
import { JobRole } from "../types/competency";
import { Card, CardContent, Button } from "../components/ui/Primitives";
import victusLogo from "../assets/victus11.png";

export const OnboardingRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState(user?.profile?.first_name || "Arun");
  const [lastName, setLastName] = useState(user?.profile?.last_name || "Kumar");
  const [selectedDept, setSelectedDept] = useState(user?.profile?.department || "Agricultural Statistics Division");
  const [selectedRoleId, setSelectedRoleId] = useState(user?.profile?.job_role_id || "");
  const [selectedDomain, setSelectedDomain] = useState(user?.profile?.domain || "Agricultural Statistics");

  // Load roles, departments, and domains from backend
  useEffect(() => {
    Promise.all([
      roleApi.getRoles(),
      metaApi.getDepartments().catch(() => []),
      metaApi.getDomains().catch(() => [])
    ])
      .then(([fetchedRoles, fetchedDepts, fetchedDomains]) => {
        setRoles(fetchedRoles);
        if (fetchedDepts.length > 0) setDepartments(fetchedDepts);
        if (fetchedDomains.length > 0) setDomains(fetchedDomains);

        if (!selectedRoleId && fetchedRoles.length > 0) {
          const statOfficer = fetchedRoles.find(r => r.code === "ROLE_STAT_OFFICER" || r.name.toLowerCase().includes("statistical officer"));
          setSelectedRoleId(statOfficer ? statOfficer.id : fetchedRoles[0].id);
        }
      })
      .catch(err => {
        console.error("Failed to load onboarding metadata:", err);
        setError("Unable to load role framework data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleNextStep = () => {
    if (activeStep === 1 && (!firstName.trim() || !lastName.trim())) {
      setError("Please specify your first and last name.");
      return;
    }
    if (activeStep === 2 && (!selectedRoleId || !selectedDept)) {
      setError("Please select your department and job role.");
      return;
    }
    setError(null);
    setActiveStep(prev => Math.min(prev + 1, 4));
  };

  const handleConfirmAndStartAssessment = async () => {
    if (!user || !selectedRole) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Update profile in backend
      const updatedProfile = await userApi.updateProfile(user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        department: selectedDept,
        designation: selectedRole.name,
        job_role_id: selectedRole.id,
        bio: `Specialization: ${selectedDomain}`
      });

      updateUser({
        ...user,
        profile: {
          ...user.profile,
          ...updatedProfile,
          domain: selectedDomain
        }
      });

      // 2. Initiate AI Role Readiness Diagnostic
      const diagResult = await assessmentApi.createRoleDiagnostic(selectedRole.id, 6);

      // 3. Direct to diagnostic assessment UI
      navigate(`/diagnostic?assessment_id=${diagResult.assessment_id}&role_name=${encodeURIComponent(selectedRole.name)}&dept=${encodeURIComponent(selectedDept)}`);
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      setError(err?.message || "Failed to initiate AI diagnostic. Please try again.");
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "01 Profile", icon: UserCheck },
    { num: 2, title: "02 Role", icon: Briefcase },
    { num: 3, title: "03 Domain", icon: Layers },
    { num: 4, title: "04 Diagnostic", icon: BrainCircuit },
    { num: 5, title: "05 Competency Twin", icon: Award }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Step Indicator Header */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={victusLogo} alt="VICTUS 11" className="h-8 w-auto bg-white p-1 rounded-md shadow-xs" />
              <div>
                <h1 className="text-base font-semibold text-white uppercase tracking-wide">VICTUS 11 Onboarding</h1>
                <p className="text-xs text-slate-400 font-normal">Statistical Workforce Competency Assessment</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
              Step {activeStep} of 5
            </span>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = s.num === activeStep;
              const isCompleted = s.num < activeStep;
              return (
                <div 
                  key={s.num}
                  className={`flex flex-col items-center text-center py-2 px-1 rounded-lg border transition-all ${
                    isActive 
                      ? "bg-gov-gold text-gov-blue-900 border-gov-gold font-bold shadow-md" 
                      : isCompleted 
                      ? "bg-slate-800 text-emerald-400 border-emerald-500/30 font-semibold" 
                      : "bg-slate-800/40 text-slate-500 border-slate-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] tracking-tight truncate w-full">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Card Content */}
        <Card className="border-slate-200 shadow-2xl overflow-hidden bg-white">
          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: PROFILE SETUP */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Let's understand your role before we assess your skills.</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Your role and domain help VICTUS 11 identify the competencies required for your work and personalize your learning path.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Arun"
                      className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-gov-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-900 font-medium outline-hidden transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Kumar"
                      className="w-full bg-slate-50 focus:bg-white border border-slate-300 focus:border-gov-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-900 font-medium outline-hidden transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold rounded-lg shadow-md text-sm uppercase tracking-wide"
                >
                  <span>Proceed to Role Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* STEP 2: DEPARTMENT & JOB ROLE */}
            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Select Your Department & Official Job Role</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Authoritative cadre mapping directly determines the required level for each competency.
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department / Division <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 focus:border-gov-blue-500 rounded-lg text-sm text-slate-900 font-medium outline-hidden transition-all cursor-pointer"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>{dept.name} ({dept.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Job Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Cadre / Job Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 focus:border-gov-blue-500 rounded-lg text-sm text-slate-900 font-medium outline-hidden transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <option value="">Loading official roles from database...</option>
                      ) : (
                        roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.code})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {selectedRole && (
                    <p className="text-xs text-slate-500 mt-1.5 italic">
                      {selectedRole.description || "Evaluated against MoSPI standard competency frameworks."}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setActiveStep(1)} className="flex-1 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNextStep} className="flex-1 py-3 bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: DOMAIN / SPECIALIZATION */}
            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Statistical Domain & Specialization</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Select your primary operational domain within official statistics.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Statistical Domain
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 focus:border-gov-blue-500 rounded-lg text-sm text-slate-900 font-medium outline-hidden transition-all cursor-pointer"
                    >
                      {domains.map((dom) => (
                        <option key={dom.id} value={dom.name}>{dom.name} ({dom.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    VICTUS 11 will generate domain-grounded diagnostic questions specific to <strong>{selectedDomain}</strong> and <strong>{selectedRole?.name}</strong>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setActiveStep(2)} className="flex-1 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNextStep} className="flex-1 py-3 bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold">
                    Review Summary <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & DIAGNOSTIC LAUNCH */}
            {activeStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile Confirmed
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Your learning journey will be personalized using your role, domain and competency requirements.
                  </h2>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Official Name</span>
                    <span className="font-bold text-slate-900">{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 font-bold uppercase">Department</span>
                    <span className="font-semibold text-slate-800">{selectedDept}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 font-bold uppercase">Cadre / Job Role</span>
                    <span className="font-extrabold text-gov-blue-700">{selectedRole?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 font-bold uppercase">Statistical Domain</span>
                    <span className="font-semibold text-slate-800">{selectedDomain}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <BrainCircuit className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    Ready for your 6-question AI Role Readiness Diagnostic. Takes ~5 minutes to evaluate baseline competency levels.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setActiveStep(3)} disabled={submitting} className="flex-1 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Edit Details
                  </Button>
                  <Button 
                    onClick={handleConfirmAndStartAssessment} 
                    disabled={submitting} 
                    className="flex-1 py-3 bg-gov-blue-600 hover:bg-gov-blue-700 text-white font-bold text-sm uppercase tracking-wide shadow-md"
                  >
                    {submitting ? "Initiating Diagnostic..." : "Start AI Diagnostic"}
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

