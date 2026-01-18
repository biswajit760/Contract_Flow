"use client";

import { useParams, useRouter } from "next/navigation";
import { useContract, ContractStatus, canTransition } from "@/app/context/ContractContext";
import {
  CheckCircle2,
  Send,
  PenTool,
  Lock,
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle,
  FileCheck,
  Mail,
  Check,
  History,
  Clock
} from "lucide-react";

/**
 * ============================================================================
 * CONTRACT WORKSPACE COMPONENT
 * ============================================================================
 */
export default function ContractWorkspace() {
  const params = useParams();
  const router = useRouter();
  
  // FIX 1: Destructure helpers instead of 'dispatch'
  // We removed dispatch to make the code cleaner and strictly typed.
  const { contracts, blueprints, updateFormData, updateStatus } = useContract();

  // 1. DATA FETCHING
  const contract = contracts.find((c) => c.id === params.id);
  const blueprint = blueprints.find((b) => b.id === contract?.blueprintId);
  
  // 2. PERMISSIONS
  const isEditable = contract?.status === "Created";

  // 3. HANDLERS
  
  // FIX 2: Use updateFormData instead of dispatch
  const handleInputChange = (fieldId: string, value: any) => {
    if (!contract || !isEditable) return;
    updateFormData(contract.id, { [fieldId]: value });
  };

  // FIX 3: Use updateStatus instead of dispatch
  const changeStatus = (newStatus: ContractStatus) => {
    if (!contract) return;
    if (confirm(`Are you sure you want to mark this contract as ${newStatus}?`)) {
      updateStatus(contract.id, newStatus);
    }
  };

  if (!contract || !blueprint) return <div className="p-10 text-center">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col pb-20">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tracking-wide bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          ID: <span className="text-slate-600">{contract.id.slice(0, 8)}</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center py-8 px-4 space-y-8">
        
        {/* --- CONTROL BAR --- */}
        <div className="w-full max-w-[95%] lg:max-w-[21cm] bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-40 transition-all mx-auto">
          
          <div className="hidden xl:block shrink-0 min-w-[80px]">
            <StatusBadge status={contract.status} />
          </div>

          <div className="flex-1 min-w-0 flex justify-center px-2 w-full">
            <VibrantTimeline currentStatus={contract.status} />
          </div>

          <div className="flex items-center gap-2 shrink-0 min-w-fit">
            {canTransition(contract.status, "Approved") && (
              <ActionButton onClick={() => changeStatus("Approved")} label="Approve" icon={<CheckCircle2 size={18} />} color="emerald" />
            )}
            {canTransition(contract.status, "Sent") && (
              <ActionButton onClick={() => changeStatus("Sent")} label="Send" icon={<Send size={18} />} color="blue" />
            )}
            {canTransition(contract.status, "Signed") && (
              <ActionButton onClick={() => changeStatus("Signed")} label="Sign" icon={<PenTool size={18} />} color="purple" />
            )}
            {canTransition(contract.status, "Locked") && (
              <ActionButton onClick={() => changeStatus("Locked")} label="Lock" icon={<Lock size={18} />} color="slate" />
            )}

            {["Created", "Approved", "Sent"].includes(contract.status) && (
              <button
                onClick={() => changeStatus("Revoked")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Revoke Contract"
              >
                <AlertTriangle size={16} />
                <span className="hidden sm:inline">Revoke</span>
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN DOCUMENT --- */}
        <div className="w-full max-w-[21cm] bg-white min-h-[29.7cm] rounded-sm shadow-xl shadow-slate-300/50 border border-slate-200 relative flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />

          {contract.status === "Revoked" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
              <div className="border-[8px] border-red-800 text-red-800 text-7xl font-black uppercase tracking-widest -rotate-12 px-12 py-8 opacity-40 mix-blend-multiply">
                VOID
              </div>
            </div>
          )}

          <div className="p-12 sm:p-16 flex-1 flex flex-col">
            <div className="mb-14 border-b-2 border-slate-900 pb-8">
              <h1 className="text-4xl font-serif font-bold text-slate-900 leading-tight mb-4">
                {contract.name}
              </h1>
              <div className="flex justify-between items-end">
                <div className="text-sm font-serif text-slate-500">
                  Effective Date:{" "}
                  <span className="font-semibold text-slate-900">{new Date(contract.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <FileText size={12} /> {contract.blueprintName}
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {blueprint.fields.map((field) => (
                <div key={field.id} className="group">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-600 transition-colors">
                    {field.label}
                  </label>

                  {(field.type === "text" || field.type === "date") && (
                    <input
                      type={field.type}
                      // FIX 4: Explicitly cast to string to fix TypeScript error shown in screenshot
                      // TypeScript fears this might be a boolean, but since field.type is text/date, we force it to string.
                      value={(contract.formData[field.id] as string) || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      disabled={!isEditable}
                      placeholder={isEditable ? "Click to enter..." : "—"}
                      className="w-full bg-transparent border-b border-slate-300 py-2 text-xl font-serif text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-blue-50/10 transition-all placeholder:text-slate-200 disabled:border-transparent disabled:text-slate-700"
                    />
                  )}

                  {field.type === "checkbox" && (
                    <label className={`
                        flex items-start gap-3 p-4 rounded-lg border border-transparent transition-all
                        ${isEditable ? "hover:bg-slate-50 cursor-pointer border-slate-200" : ""}
                        ${contract.formData[field.id] ? "bg-blue-50/30" : ""}
                    `}>
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={!!contract.formData[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.checked)}
                          disabled={!isEditable}
                          className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                      <span className="text-base font-serif text-slate-800 leading-relaxed">
                        {field.label}
                      </span>
                    </label>
                  )}

                  {field.type === "signature" && (
                    <div className="mt-8 pt-4">
                      {["Signed", "Locked"].includes(contract.status) ? (
                        <div className="inline-block relative min-w-[240px]">
                          <div className="font-serif italic text-4xl text-blue-900/90 pr-12 pb-3 border-b-2 border-blue-900/10">
                            Signed Digitally
                          </div>
                          <div className="absolute top-0 right-0 text-emerald-500 bg-white rounded-full p-1 shadow-sm">
                            <Shield size={20} fill="currentColor" className="opacity-20" />
                            <Check size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" strokeWidth={3} />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase tracking-widest font-bold flex items-center gap-1">
                             Verified by ContractFlow
                          </p>
                        </div>
                      ) : (
                        <div className="h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 transition-colors">
                          <PenTool size={24} className="opacity-30" />
                          <span className="text-xs font-bold uppercase tracking-wider">Signature Required</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-16 flex justify-between items-center text-[10px] text-slate-300 font-mono uppercase tracking-widest border-t border-slate-50">
              <div className="flex items-center gap-2">
                 <Shield size={12} /> Secure Document
              </div>
              <div>Page 1 of 1</div>
            </div>
          </div>
        </div>

        {/* --- AUDIT TRAIL --- */}
        <div className="w-full max-w-[21cm] mt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={16} /> Audit History
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="space-y-6 relative border-l-2 border-slate-100 ml-3">
                    {contract.history && contract.history.length > 0 ? contract.history.slice().reverse().map((event, i) => (
                         <div key={i} className="pl-6 relative">
                            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold ${i === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                                    Marked as {event.status}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(event.timestamp).toLocaleString()}
                                </span>
                            </div>
                         </div>
                    )) : (
                        <div className="pl-6 text-sm text-slate-400 italic">No history recorded yet.</div>
                    )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Created: "bg-slate-100 text-slate-600",
    Approved: "bg-emerald-50 text-emerald-700",
    Sent: "bg-blue-50 text-blue-700",
    Signed: "bg-purple-50 text-purple-700",
    Locked: "bg-slate-800 text-slate-100",
    Revoked: "bg-red-50 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}

function VibrantTimeline({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { id: "Created", icon: <FileText size={14} />, colorClass: "bg-slate-600 shadow-slate-200" },
    { id: "Approved", icon: <FileCheck size={14} />, colorClass: "bg-emerald-500 shadow-emerald-200" },
    { id: "Sent", icon: <Mail size={14} />, colorClass: "bg-blue-500 shadow-blue-200" },
    { id: "Signed", icon: <PenTool size={14} />, colorClass: "bg-purple-500 shadow-purple-200" },
    { id: "Locked", icon: <Lock size={14} />, colorClass: "bg-slate-800 shadow-slate-300" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex items-center w-full max-w-md justify-between">
      {steps.map((step, index) => {
        const active = currentIndex === index;
        const completed = currentIndex > index;
        let circleStyle = "bg-slate-100 text-slate-300 scale-100 border border-slate-200"; 
        
        if (completed) circleStyle = "bg-slate-800 text-white scale-100 border border-slate-800"; 
        if (active) circleStyle = `${step.colorClass} text-white scale-125 shadow-lg ring-4 ring-white z-10 border-transparent`;

        return (
          <div key={step.id} className="relative flex flex-col items-center flex-1 last:flex-none group">
            {index < steps.length - 1 && (
               <div className={`absolute top-1/2 left-[50%] w-full h-0.5 -z-10 -translate-y-1/2 transition-colors duration-500 ${completed ? "bg-slate-800" : "bg-slate-200"}`} />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${circleStyle}`}>
              {step.icon}
            </div>
            <div className={`absolute -bottom-6 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${active ? "text-slate-800 opacity-100 translate-y-0 scale-110" : "text-slate-400 opacity-0 group-hover:opacity-100"}`}>
              {step.id}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActionButton({ onClick, label, icon, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
    slate: "bg-slate-800 hover:bg-slate-900 shadow-slate-300",
  };
  return (
    <button onClick={onClick} className={`${colors[color]} flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98]`}>
      {icon} {label}
    </button>
  );
}