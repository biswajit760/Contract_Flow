"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContract } from "@/app/context/ContractContext";
import { 
  FileText, Zap, CheckCircle, Plus, 
  LayoutTemplate, ArrowRight, Search, TrendingUp, Lock 
} from "lucide-react";
import { NavBar } from "@/components/NavBar";

export default function ContractsPage() {
  const router = useRouter();
  const { contracts } = useContract();
  const [filter, setFilter] = useState("All");

  // --- 1. UPDATED STATS LOGIC ---
  const stats = {
    total: contracts.length,
    // Active now includes "Sent" since we removed the Pending category
    active: contracts.filter(c => ["Created", "Approved", "Sent"].includes(c.status)).length,
    // Signed is now strictly "Signed" (waiting to be locked)
    signed: contracts.filter(c => c.status === "Signed").length,
    // New "Locked" Category
    locked: contracts.filter(c => c.status === "Locked").length,
  };

  // --- 2. UPDATED FILTER LOGIC ---
  const filteredContracts = contracts.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Active") return ["Created", "Approved", "Sent"].includes(c.status);
    if (filter === "Signed") return c.status === "Signed";
    if (filter === "Locked") return c.status === "Locked"; // New Filter
    if (filter === "Revoked") return c.status === "Revoked";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <NavBar />

      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 pt-10 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Contract Manager</h1>
              <p className="text-slate-400 mt-2 text-lg">Track, manage, and execute your agreements.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push("/blueprints/new")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2.5 rounded-lg transition-all text-sm font-medium backdrop-blur-sm"
              >
                <LayoutTemplate size={16} /> Templates
              </button>
              <button 
                onClick={() => router.push("/")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-900/50 transition-all text-sm font-bold"
              >
                <Plus size={18} /> New Contract
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 space-y-8">
        
        {/* --- SECTION 1: FLOATING STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Contracts" 
            value={stats.total} 
            icon={<FileText size={20} className="text-white" />} 
            gradient="from-slate-700 to-slate-800"
            trend="All Time"
          />
          <StatCard 
            label="Active In-Progress" 
            value={stats.active} 
            icon={<Zap size={20} className="text-white" />} 
            gradient="from-blue-500 to-blue-600"
            trend="Drafts & Sent"
          />
          <StatCard 
            label="Signed (Open)" 
            value={stats.signed} 
            icon={<CheckCircle size={20} className="text-white" />} 
            gradient="from-emerald-500 to-teal-600"
            trend="Action Required"
          />
          {/* REPLACED PENDING WITH LOCKED */}
          <StatCard 
            label="Locked & Secure" 
            value={stats.locked} 
            icon={<Lock size={20} className="text-white" />} 
            gradient="from-slate-600 to-gray-700"
            trend="Finalized"
          />
        </div>

        {/* --- SECTION 2: SMART FILTER & SEARCH --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
          {/* Segmented Control Filter */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto max-w-full no-scrollbar">
            {["All", "Active", "Signed", "Locked", "Revoked"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${filter === tab 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="pl-10 pr-4 py-2 w-full md:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* --- SECTION 3: PREMIUM TABLE --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-5 pl-8">Contract Name</th>
                  <th className="p-5">Template Used</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <FileText size={32} className="opacity-20" />
                        </div>
                        <p className="text-lg font-medium text-slate-900">No contracts found</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContracts.slice().reverse().map((contract) => (
                    <tr 
                      key={contract.id} 
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                      className="group hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-1 h-12 rounded-full ${getStatusColor(contract.status)} shadow-sm group-hover:scale-y-110 transition-transform`}></div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                              {contract.name || "Untitled Contract"}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-1">ID: {contract.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                         <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-2 py-1 rounded-md w-fit text-xs font-medium border border-slate-200">
                           <LayoutTemplate size={12} />
                           {contract.blueprintName}
                         </div>
                      </td>
                      <td className="p-5">
                        <StatusBadge status={contract.status} />
                      </td>
                      <td className="p-5">
                        <div className="text-slate-500 font-medium text-xs">
                           {new Date(contract.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                           <span className="text-xs font-bold text-blue-600 mr-2">View</span>
                           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                             <ArrowRight size={14} />
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ label, value, icon, gradient, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 rounded-bl-3xl bg-gradient-to-br ${gradient}`}></div>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full w-fit">
            <TrendingUp size={10} /> {trend}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${gradient}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Created: "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10",
    Approved: "bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500/10",
    Sent: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10",
    Signed: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10",
    Locked: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/10",
    Revoked: "bg-red-50 text-red-700 border-red-100 ring-red-500/10",
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ring-1 ring-inset
      ${styles[status]}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Revoked' ? 'bg-red-500' : 'bg-current'}`}></span>
      {status}
    </span>
  );
}

function getStatusColor(status: string) {
   if (status === 'Locked') return 'bg-slate-600';
   if (status === 'Signed') return 'bg-emerald-500';
   if (status === 'Revoked') return 'bg-red-500';
   if (status === 'Sent') return 'bg-amber-500';
   if (status === 'Approved') return 'bg-indigo-500';
   return 'bg-blue-500';
}