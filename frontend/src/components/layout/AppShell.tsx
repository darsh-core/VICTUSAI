import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Award, 
  BookOpen, 
  Map, 
  User, 
  LogOut, 
  Menu, 
  X, 
  TrendingDown, 
  HelpCircle,
  FileText,
  PlusCircle,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Lock,
  BarChart2,
  Users,
  FileCheck,
  Sparkles,
  Bell
} from "lucide-react"

import { useAuthStore } from "../../store/authStore"
import { cn } from "../../lib/utils"
import { CopilotDrawer } from "../copilot/CopilotDrawer"

import victusLogo from "../../assets/victusai.png"

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isTrainerOrStaff = Boolean(
    user?.is_superuser || 
    user?.email?.toLowerCase().includes("trainer") ||
    user?.profile?.designation?.toLowerCase().includes("director") ||
    user?.profile?.designation?.toLowerCase().includes("trainer") ||
    user?.roles?.some(r => 
      ["TRAINER", "ADMIN", "ADMINISTRATOR", "EVALUATOR", "SUPERVISOR", "MANAGER"].includes(r.name?.toUpperCase())
    )
  );

  const isUnassessed = !isTrainerOrStaff && user?.has_completed_assessment === false;

  const navItems = isTrainerOrStaff
    ? [
        { name: "Academy Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Workforce Analytics", path: "/analytics/workforce", icon: BarChart2 },
        { name: "Employees", path: "/employees", icon: Users },
        { name: "Competency Framework", path: "/competencies", icon: Award },
        { name: "Document Intelligence", path: "/documents", icon: FileText },
        { name: "AI Question Review", path: "/questions/review", icon: FileCheck },
        { name: "Assessments", path: "/assessments/create", icon: PlusCircle },
        { name: "Recommendations", path: "/recommendations", icon: BookOpen },
        { name: "Learning Plans", path: "/learning-plans", icon: Map },
        { name: "Training Effectiveness", path: "/training-effectiveness", icon: TrendingUp },
        { name: "AI Insights", path: "/ai-insights", icon: Sparkles },
        { name: "Alerts", path: "/alerts", icon: Bell },
        { name: "Reports", path: "/reports", icon: FileText },
        { name: "Profile", path: "/profile", icon: User }
      ]

    : isUnassessed
    ? [
        { name: "Diagnostic Assessment", path: "/onboarding/role", icon: ShieldCheck, isRequired: true },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, isLocked: true },
        { name: "Role Readiness", path: "/role-readiness", icon: ShieldCheck, isLocked: true },
        { name: "Skill Gaps", path: "/skill-gaps", icon: AlertTriangle, isLocked: true },
        { name: "iGOT Recommendations", path: "/recommendations", icon: BookOpen, isLocked: true },
        { name: "Learning Plan", path: "/learning-plan", icon: Map, isLocked: true },
        { name: "Profile", path: "/profile", icon: User }
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Role Readiness", path: "/role-readiness", icon: ShieldCheck },
        { name: "Skill Gaps", path: "/skill-gaps", icon: AlertTriangle },
        { name: "iGOT Recommendations", path: "/recommendations", icon: BookOpen },
        { name: "Learning Plan", path: "/learning-plan", icon: Map },
        { name: "Assessments & Practice", path: "/assessments/create", icon: PlusCircle },
        { name: "Progress & History", path: "/progress", icon: TrendingUp },
        { name: "My Competencies", path: "/competencies", icon: Award },
        { name: "Profile", path: "/profile", icon: User }
      ];


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Official Govt Strip */}
      <div className="bg-[#1a1a1a] text-slate-200 py-2 px-6 text-xs md:text-xs font-semibold flex justify-between items-center z-40 relative">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="text-white font-bold tracking-wide">भारत सरकार</span>
            <span className="opacity-50">|</span>
            <span className="tracking-wide">GOVERNMENT OF INDIA</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="tracking-wide">iGOT Karmayogi Competency Intelligence Platform</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row relative">
      {/* 1. Header for mobile */}
      <header className="bg-gov-blue-500 text-white px-5 py-3 flex items-center justify-between md:hidden border-b border-gov-blue-600 shadow-sm z-30">
        <div className="flex items-center gap-2.5">
          <img src={victusLogo} alt="VICTUS AI Logo" className="h-8 w-auto bg-white p-0.5 rounded" />
          <div>
            <span className="font-bold tracking-tight text-base uppercase text-white block">VICTUS AI</span>
            <span className="text-[10px] text-amber-300 font-bold block">AI-Powered Skill Intelligence</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-1.5 hover:bg-gov-blue-600 rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* 2. Drawer Nav for Mobile (overlay) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-xs" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 3. Navigation Sidebar (Desktop & Mobile Drawer container) */}
      <aside 
        className={cn(
          "bg-gov-blue-500 text-white w-72 flex flex-col border-r border-gov-blue-600 flex-shrink-0 z-20 transition-all duration-300 md:translate-x-0 fixed md:static inset-y-0 left-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand block */}
        <div className="p-5 border-b border-gov-blue-600 hidden md:flex items-center gap-3 bg-slate-900/20">
          <img src={victusLogo} alt="VICTUS AI Logo" className="h-10 w-auto bg-white p-1 rounded-lg shrink-0 shadow-md" />
          <div className="min-w-0">
            <h1 className="font-extrabold leading-tight tracking-wider text-base uppercase text-white">VICTUS AI</h1>
            <p className="text-[11px] text-amber-300 leading-tight tracking-wide font-bold">AI-Powered Skill Intelligence for iGOT Karmayogi</p>
          </div>
        </div>

        {/* User context card */}
        {user && (
          <div className="p-5 border-b border-gov-blue-600 bg-gov-blue-600/30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gov-gold text-gov-blue-900 font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
                {user.profile?.first_name?.charAt(0) || (user.email?.includes("trainer") ? "S" : "U")}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">
                  {user.profile?.first_name ? `${user.profile.first_name} ${user.profile.last_name || ""}` : (user.email?.includes("trainer") ? "Dr. Sunita Sharma" : user.email)}
                </h4>
                <p className="text-xs text-slate-200 truncate font-medium">
                  {user.profile?.designation || (user.email?.includes("trainer") ? "Senior Training Director · NSSTA" : "Statistical Staff")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            
            if (item.isLocked) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg text-slate-400/60 bg-gov-blue-600/10 cursor-not-allowed select-none opacity-60"
                  title="Complete initial diagnostic assessment to unlock"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 shrink-0 text-slate-400/50" />
                    <span>{item.name}</span>
                  </div>
                  <Lock className="h-4 w-4 text-amber-400/70 shrink-0" />
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all group",
                  isActive 
                    ? "bg-gov-gold text-gov-blue-900 shadow-md font-bold text-sm" 
                    : "text-slate-100 hover:bg-gov-blue-600 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-gov-blue-900" : "text-slate-300 group-hover:text-white")} />
                  <span>{item.name}</span>
                </div>
                {item.isRequired && (
                  <span className="text-[11px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-xs">
                    Required
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions inside Sidebar */}
        <div className="p-4 border-t border-gov-blue-600 space-y-1.5">
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg text-slate-200 hover:bg-gov-blue-600 hover:text-white transition-colors"
          >
            <HelpCircle className="h-4.5 w-4.5 text-slate-300" />
            <span>Help & Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg text-rose-300 hover:bg-rose-950/30 hover:text-rose-100 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 4. Main content viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-3.5 hidden md:flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <img src={victusLogo} alt="VICTUS AI Logo" className="h-7 w-auto" />
            <span className="text-sm text-slate-700 font-extrabold tracking-wide uppercase">VICTUS AI <span className="text-slate-300 font-normal">|</span> <span className="text-xs text-slate-500 font-bold uppercase">AI-Powered Skill Intelligence for iGOT Karmayogi</span></span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Logged in as</span>
              <span className="text-sm font-extrabold text-gov-blue-700">{user?.email}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-300" />
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* App content views */}
        <div className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Global MoSPI AI Copilot Widget */}
      <CopilotDrawer />
      </div>
    </div>
  )
}
