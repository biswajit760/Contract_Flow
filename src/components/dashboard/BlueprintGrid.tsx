"use client";
import { useRouter } from "next/navigation";
import { Blueprint } from "@/app/context/ContractContext";
import { ArrowRight, Plus, FileText, PenTool } from "lucide-react";

interface Props {
  blueprints: Blueprint[];
  onSelect: (bp: Blueprint) => void;
}

export function BlueprintGrid({ blueprints, onSelect }: Props) {
  const router = useRouter();

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Start from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Blueprint</span>
          </h2>
          <p className="text-sm text-slate-500">Select a template to draft a new agreement.</p>
        </div>
        
        {blueprints.length > 0 && (
          <button 
            onClick={() => router.push("/blueprints")} 
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: CREATE NEW (Always visible) */}
        <div 
          onClick={() => router.push("/blueprints/new")} 
          className="col-span-1 bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-white/80 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">New Blueprint</h3>
        </div>

        {/* CARDS: EXISTING BLUEPRINTS */}
        {blueprints.map((bp) => (
          <div 
            key={bp.id} 
            onClick={() => onSelect(bp)} 
            className="group bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden min-h-[180px] flex flex-col justify-between"
          >
            {/* Background Icon Effect */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12">
              <FileText size={80} className="text-blue-600" />
            </div>
            
            {/* Content */}
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-2">
              <PenTool size={18} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{bp.name}</h3>
              <p className="text-xs text-slate-500">{bp.fields.length} Fields Configured</p>
            </div>
            
            {/* Hover Action Text */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-blue-600 text-xs font-bold uppercase tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              Use Template
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}