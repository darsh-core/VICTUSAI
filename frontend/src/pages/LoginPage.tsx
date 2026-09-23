import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, Lock, Mail, ShieldAlert } from "lucide-react"

import { authApi } from "../services/authApi"
import { useAuthStore } from "../store/authStore"
import { Button, Card, CardContent, Alert } from "../components/ui/Primitives"
import { DEMO_MODE, DEMO_CREDENTIALS } from "../lib/constants"

import victusLogo from "../assets/victus11.png"

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect based on assessment completion
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      if (user.has_completed_assessment) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding/role");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      const userProfile = await authApi.getMe(data.access_token);
      setAuth(data.access_token, data.refresh_token, userProfile);
      
      if (userProfile.has_completed_assessment) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding/role");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      const userProfile = await authApi.getMe(data.access_token);
      setAuth(data.access_token, data.refresh_token, userProfile);
      
      if (userProfile.has_completed_assessment) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding/role");
      }
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError(err.message || "Demo login failed. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      
      {/* Official Govt Strip */}
      <header className="bg-slate-950 text-slate-300 py-2.5 px-6 text-xs font-medium flex justify-between items-center z-40 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold tracking-wide">भारत सरकार</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-normal">GOVERNMENT OF INDIA</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span>MoSPI Competency Intelligence</span>
          <span className="text-slate-600">•</span>
          <span>iGOT Karmayogi Platform</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header Block */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-white shadow-xs border border-slate-200 mb-3">
            <img src={victusLogo} alt="VICTUS 11 Logo" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            VICTUS 11
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            AI-Powered Skill Intelligence for iGOT Karmayogi
          </p>
        </div>

        {/* Login Card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="border border-slate-200/80 shadow-md bg-white rounded-xl overflow-hidden">
            <CardContent className="py-7 px-6 sm:px-8">
              {error && (
                <Alert variant="destructive" className="mb-5 bg-rose-50 border-rose-200 text-rose-800">
                  <div className="flex gap-2 items-start">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    <span className="font-medium text-xs leading-relaxed">{error}</span>
                  </div>
                </Alert>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email Address
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                      placeholder="employee@mospi.gov.in"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-normal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors text-sm"
                    isLoading={loading}
                  >
                    Sign In
                  </Button>
                </div>
              </form>

              {DEMO_MODE && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="relative flex justify-center text-xs text-slate-400 font-medium mb-3">
                    <span className="bg-white px-2">Fast-Track Demonstration</span>
                  </div>
                  <div>
                    <button
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Demo Login as Ramesh Chandra (Officer)</span>
                    </button>
                    <p className="mt-2.5 text-center text-[11px] text-slate-500 leading-relaxed">
                      Preloads sample MoSPI officer profile (72.4% Readiness, 2.3 Sampling Gap).
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-slate-500 mt-5 font-normal">
            Ministry of Statistics & Programme Implementation (MoSPI)
          </p>
        </div>
      </div>
    </div>
  )
}
