"use client";

import Link from "next/link";
import {
  Plus,
  FileText,
  ArrowRight,
  PenTool,
  Send,
  Eye,
  CheckCircle2,
  Lock,
} from "lucide-react";

const steps = [
  { icon: PenTool, label: "Draft", color: "text-slate-500" },
  { icon: Send, label: "Sent", color: "text-blue-600" },
  { icon: Eye, label: "Viewed", color: "text-amber-500" },
  { icon: CheckCircle2, label: "Signed", color: "text-emerald-600" },
  { icon: Lock, label: "Locked", color: "text-slate-400" },
];

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 overflow-hidden bg-white border-b border-slate-100 selection:bg-blue-100">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div
        className="absolute inset-0 z-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-[80px] animate-float mix-blend-multiply" />
        <div
          className="absolute -bottom-[10%] -right-[5%] w-[35rem] h-[35rem] bg-blue-200/40 rounded-full blur-[80px] animate-float mix-blend-multiply"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Simple Contract Management,
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Designed for Clarity
          </span>
        </h1>

        <p className="mt-4 text-xl text-slate-500 max-w-2xl leading-relaxed mx-auto">
          Create reusable blueprints, generate agreements in seconds,
          and streamline your entire document lifecycle.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/blueprints/new"
            className="focus-ring flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5
            transition-all duration-200"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Blueprint
          </Link>

          <Link
            href="/contracts"
            className="focus-ring group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold
            hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <FileText size={20} />
            View Contracts
            <ArrowRight
              size={16}
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            />
          </Link>
        </div>
      </div>

      {/* --- COMPACT TIMELINE --- */}
      <div className="relative mt-12 z-20 w-[95%] max-w-5xl mx-auto mb-8">
      
      {/* 1. VIBRANT AURORA GLOW */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 opacity-15 blur-3xl rounded-full pointer-events-none animate-pulse-slow" />
      
      {/* 2. PRISM GLASS CONTAINER (Reduced Padding) */}
      <div className="relative backdrop-blur-2xl bg-white/40 border border-white/60 shadow-2xl shadow-indigo-500/10 rounded-2xl px-8 py-6 ring-1 ring-white/70">
        
        <div className="flex items-center justify-between w-full relative">
          
          {/* Continuous Gradient Line Background (Adjusted top position for smaller icons) */}
          <div className="absolute top-[26px] left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 z-0" />

          {steps.map((step) => (
            <div key={step.label} className="flex-1 flex flex-col items-center relative z-10 group cursor-default">
              
              {/* Glossy Icon Tile (Compact Size: w-12 h-12) */}
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-white to-white/80 border border-white shadow-lg shadow-indigo-900/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-indigo-500/20">
                <step.icon size={20} className={step.color} strokeWidth={2.5} />
              </div>

              {/* Text Label (Closer margin) */}
              <div className="mt-3 text-center">
                <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500 bg-white/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .focus-ring:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.35);
        }
      `}</style>
    </section>
  );
}