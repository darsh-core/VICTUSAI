import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, FileText, ArrowLeft, CheckCircle, AlertTriangle, Layers, Cpu, Sparkles, Check } from "lucide-react"

import { documentApi } from "../services/documentApi"
import { Button, Card, Alert } from "../components/ui/Primitives"

const STAGES = [
  { id: "UPLOADING", label: "Uploading", icon: Upload },
  { id: "EXTRACTING", label: "Extracting", icon: FileText },
  { id: "CHUNKING", label: "Chunking", icon: Layers },
  { id: "EMBEDDING", label: "Embedding", icon: Cpu },
  { id: "INDEXED", label: "Indexed", icon: CheckCircle }
];

export const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE"); // IDLE, UPLOADING, PROCESSING, INDEXED, FAILED
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Poll processing status if docId is set
  useEffect(() => {
    if (!docId) return;

    const interval = setInterval(async () => {
      try {
        const details = await documentApi.getDocument(docId);
        setStatus(details.status);
        
        if (details.status === "INDEXED" || details.status === "READY") {
          setProgress(100);
          clearInterval(interval);
        } else if (details.status === "FAILED") {
          setProgress(0);
          setError(details.metadata?.error || "Document processing failed. Please try again.");
          clearInterval(interval);
        } else if (details.status === "PROCESSING") {
          setProgress((prev) => (prev < 85 ? prev + 5 : 85));
        } else if (details.status === "UPLOADED") {
          setProgress(40);
        }
      } catch (err: any) {
        clearInterval(interval);
        setError(err.message || "Failed to fetch document status");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [docId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "pptx", "txt"].includes(ext || "")) {
      setError("Unsupported file format. Please upload PDF, DOCX, PPTX, or TXT.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 30 * 1024 * 1024) {
      setError("File exceeds 30MB size limit.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("UPLOADING");
    setProgress(15);
    setError(null);

    try {
      const res = await documentApi.uploadDocument(file);
      setDocId(res.document_id);
      if (res.is_duplicate) {
        setStatus(res.status === "READY" || res.status === "INDEXED" ? "READY" : res.status);
        setProgress(100);
      } else {
        setStatus(res.status);
        setProgress(35);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed. Verify server is running.");
      setStatus("FAILED");
      setUploading(false);
    }
  };

  const getStageState = (stageId: string) => {
    if (status === "INDEXED" || status === "READY" || progress >= 100) {
      return "completed";
    }
    if (status === "FAILED") {
      return "failed";
    }

    switch (stageId) {
      case "UPLOADING":
        if (status === "UPLOADING") return "active";
        if (progress >= 15 || ["UPLOADED", "PROCESSING"].includes(status)) return "completed";
        return "pending";
      case "EXTRACTING":
        if (status === "UPLOADED") return "active";
        if (progress >= 40 || status === "PROCESSING") return "completed";
        return "pending";
      case "CHUNKING":
        if (status === "PROCESSING" && progress <= 65) return "active";
        if (progress > 65) return "completed";
        return "pending";
      case "EMBEDDING":
        if (status === "PROCESSING" && progress > 65) return "active";
        if (progress >= 95) return "completed";
        return "pending";
      case "INDEXED":
        if (status === "INDEXED" || status === "READY" || progress >= 100) return "completed";
        return "pending";
      default:
        return "pending";
    }
  };

  const getCurrentStageLabel = () => {
    if (status === "INDEXED" || status === "READY" || progress >= 100) return "Indexed & Ready";
    if (status === "UPLOADING") return "Uploading File";
    if (status === "UPLOADED") return "Extracting Text";
    if (status === "PROCESSING") {
      return progress <= 65 ? "Chunking Content" : "Embedding Vectors";
    }
    return "Processing";
  };

  // SVG Circular Math
  const radius = 95;
  const circumference = 2 * Math.PI * radius; // ~596.9
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => navigate("/documents")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-slate-800">Upload Training Material</h1>
      </div>

      <Card className="p-8">
        {status === "IDLE" && (
          <div className="space-y-6">
            {/* Drag drop area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragActive ? "border-gov-blue-500 bg-gov-blue-50/50" : "border-slate-300 hover:border-gov-blue-400"
              }`}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input 
                id="fileInput"
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileChange}
              />
              <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="font-semibold text-slate-700">Drag & drop your training material here</p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, PPTX, or TXT (Max 30MB)</p>
            </div>

            {file && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gov-blue-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800 truncate max-w-sm">{file.name}</p>
                    <p className="text-slate-400 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="primary" onClick={handleUpload}>
                  Start Uploading
                </Button>
              </div>
            )}
          </div>
        )}

        {status !== "IDLE" && (
          <div className="space-y-8 py-4">
            {/* Gradient Circular Progress Ring */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md" viewBox="0 0 230 230">
                <defs>
                  <linearGradient id="circleGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B192C" />
                    <stop offset="45%" stopColor="#2563EB" />
                    <stop offset="85%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                  <linearGradient id="completedCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                
                {/* Background Ring Track */}
                <circle
                  cx="115"
                  cy="115"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="transparent"
                />

                {/* Animated Gradient Outer Ring */}
                <circle
                  cx="115"
                  cy="115"
                  r={radius}
                  stroke={status === "INDEXED" || status === "READY" ? "url(#completedCircleGradient)" : "url(#circleGradientRing)"}
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Content with Percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gov-blue-900 via-blue-700 to-amber-600 bg-clip-text text-transparent">
                  {progress}%
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                  {getCurrentStageLabel()}
                </span>
                <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
                  <div className={`w-2 h-2 rounded-full ${status === "INDEXED" || status === "READY" ? "bg-emerald-500" : "bg-gov-blue-600 animate-ping"}`} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Stage Titles Timeline Cards */}
            <div>
              <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Pipeline Processing Stages
              </p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {STAGES.map((stage) => {
                  const stageState = getStageState(stage.id);
                  const Icon = stage.icon;

                  return (
                    <div 
                      key={stage.id}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition-all duration-300 ${
                        stageState === "completed"
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-sm"
                          : stageState === "active"
                          ? "bg-blue-50 border-gov-blue-500 text-gov-blue-900 shadow-md ring-2 ring-gov-blue-200 scale-105"
                          : "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                        stageState === "completed"
                          ? "bg-emerald-500 text-white"
                          : stageState === "active"
                          ? "bg-gov-blue-600 text-white animate-pulse"
                          : "bg-slate-200 text-slate-500"
                      }`}>
                        {stageState === "completed" ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-xs font-bold truncate max-w-full leading-tight">{stage.label}</span>
                      <span className="text-[9px] mt-1 font-semibold uppercase tracking-wider">
                        {stageState === "completed" ? "Done" : stageState === "active" ? "Processing" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {(status === "INDEXED" || status === "READY") && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3 shadow-sm animate-fade-in">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                <div>
                  <h3 className="font-bold text-emerald-900 text-base">Document Successfully Indexed!</h3>
                  <p className="text-emerald-700 text-xs mt-0.5">Vector embeddings are stored in pgvector and ready for RAG grounding.</p>
                </div>
                <div className="flex justify-center gap-3 pt-1">
                  <Button variant="secondary" onClick={() => navigate("/documents")}>
                    Return to Documents
                  </Button>
                  <Button variant="primary" onClick={() => navigate(`/documents/${docId}/generate`)}>
                    Generate MCQs Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive" title="Error Processing Document" className="mt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <div className="mt-2 text-right">
              <Button variant="secondary" size="sm" onClick={() => { setStatus("IDLE"); setFile(null); setError(null); }}>
                Try Again
              </Button>
            </div>
          </Alert>
        )}
      </Card>
    </div>
  );
};

