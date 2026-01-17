"use client";

import Link from "next/link";
import { Plus, FileText, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 overflow-hidden bg-white border-b border-slate-100">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.3]" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* 2. Animated Gradient Orbs (2 Corners) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-Left Orb */}
        <div className="absolute -top-[10%] -left-[5%] w-[30rem] h-[30rem] bg-purple-200/40 rounded-full blur-[80px] animate-float mix-blend-multiply" />
        
        {/* Bottom-Right Orb */}
        <div className="absolute -bottom-[10%] -right-[5%] w-[35rem] h-[35rem] bg-blue-200/40 rounded-full blur-[80px] animate-float mix-blend-multiply" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        
        
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Simple Contract Management, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Designed for Clarity
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl text-slate-500 max-w-2xl leading-relaxed mx-auto">
          Create reusable blueprints, generate agreements in seconds, 
          and streamline your entire document lifecycle.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/blueprints/new"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Blueprint
          </Link>

          <Link
            href="/contracts"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <FileText size={20} />
            View Contracts
            <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </div>

      {/* --- ANIMATION STYLES --- */}
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
      `}</style>
    </section>
  );
}