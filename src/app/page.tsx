"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContract, Contract, Blueprint } from "@/app/context/ContractContext";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input"; 
import HeroSection from "@/components/HeroSection"; 
import { NavBar } from "@/components/NavBar";
import { 
  Plus, FileText, PenTool, X, ArrowRight, Clock, File 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { blueprints, contracts, dispatch } = useContract();

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [newContractName, setNewContractName] = useState("");

  // --- FILTER STATE (Updated) ---
  const [filter, setFilter] = useState<"All" | "Active" | "Signed" | "Revoked">("All");

  // --- ACTIONS ---
  const handleOpenCreateModal = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setNewContractName(`${blueprint.name} - ${new Date().toLocaleDateString()}`);
    setIsModalOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!selectedBlueprint) return;
    const newContractId = crypto.randomUUID();
    const finalName = newContractName.trim() || "Untitled Contract";

    const newContract: Contract = {
      id: newContractId,
      blueprintId: selectedBlueprint.id,
      blueprintName: selectedBlueprint.name,
      name: finalName,
      status: "Created",
      formData: {},
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "CREATE_CONTRACT", payload: newContract });
    router.push(`/contracts/${newContractId}`);
  };

  // --- FILTER LOGIC (Updated with Revoked) ---
  const filteredContracts = contracts.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Active") return ["Created", "Approved", "Sent"].includes(c.status);
    if (filter === "Signed") return ["Signed", "Locked"].includes(c.status);
    if (filter === "Revoked") return c.status === "Revoked";
    return true;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[10%] -right-[10%] w-[50rem] h-[50rem] bg-blue-100/50 rounded-full blur-[100px] animate-float mix-blend-multiply" />
         <div className="absolute top-[20%] -left-[10%] w-[40rem] h-[40rem] bg-purple-100/50 rounded-full blur-[100px] animate-float mix-blend-multiply" style={{ animationDelay: '3s' }} />
         <div className="absolute bottom-[10%] right-[20%] w-[35rem] h-[35rem] bg-indigo-100/40 rounded-full blur-[80px] animate-float mix-blend-multiply" style={{ animationDelay: '5s' }} />
      </div>

      <div className="relative z-10">
        <NavBar />
        <HeroSection />

        <main className="max-w-7xl mx-auto px-6 space-y-16 mt-8">

          {/* --- SECTION 3: TEMPLATES --- */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Start from Template</h2>
                <p className="text-sm text-slate-500">Select a blueprint to draft a new agreement instantly.</p>
              </div>
              {blueprints.length > 0 && (
                <button 
                  onClick={() => router.push("/blueprints/new")} 
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
                >
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blueprints.length === 0 ? (
                 <div onClick={() => router.push("/blueprints/new")} className="col-span-full bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-white/80 transition-all cursor-pointer group">
                   <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><Plus size={24} className="text-blue-600" /></div>
                   <h3 className="font-bold text-slate-900">Create your first Blueprint</h3>
                   <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Define a reusable structure with text fields, dates, and signatures.</p>
                 </div>
              ) : (
                blueprints.map((bp) => (
                  <div key={bp.id} onClick={() => handleOpenCreateModal(bp)} className="group bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12"><FileText size={80} className="text-blue-600" /></div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><PenTool size={18} /></div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">{bp.fields.length} Fields</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1 truncate pr-2">{bp.name}</h3>
                    <p className="text-xs text-slate-500">Click to draft contract</p>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-blue-600 text-xs font-bold uppercase tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">Use Template</div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* --- SECTION 4: RECENT ACTIVITY --- */}
          <section className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="text-slate-500 text-sm">Real-time status of your latest documents.</p>
              </div>
              
              {/* --- INTERACTIVE FILTER BUTTONS (Updated) --- */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                 {["All", "Active", "Signed", "Revoked"].map((f) => (
                   <button
                     key={f}
                     onClick={() => setFilter(f as any)}
                     className={`
                       px-3 py-1 text-xs font-bold rounded transition-all
                       ${filter === f 
                         ? "bg-white text-slate-800 shadow-sm ring-1 ring-black/5" 
                         : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}
                     `}
                   >
                     {f}
                   </button>
                 ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-5 pl-8">Contract Name</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Created Date</th>
                    <th className="p-5 text-right pr-8">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                              <File size={20} className="opacity-30" />
                          </div>
                          <p>No {filter !== 'All' ? filter.toLowerCase() : ''} contracts found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.slice().reverse().map((contract) => (
                      <tr 
                          key={contract.id} 
                          className="hover:bg-blue-50/40 transition-colors group cursor-pointer" 
                          onClick={() => router.push(`/contracts/${contract.id}`)}
                      >
                        <td className="p-5 pl-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-1 h-10 rounded-full ${getStatusColor(contract.status)} shadow-sm`}></div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                                {contract.name || "Untitled Contract"}
                              </div>
                              <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                                Template: <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">{contract.blueprintName}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5"><StatusBadge status={contract.status} /></td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-500 font-medium">
                             <Clock size={14} className="text-slate-400" />
                             {new Date(contract.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-5 text-right pr-8">
                          <Button variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all text-xs h-9 px-4">Open Contract</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>

      {isModalOpen && selectedBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Contract</h3>
                <p className="text-xs text-slate-500 mt-0.5">Using template: <span className="font-medium text-blue-600">{selectedBlueprint.name}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-red-50"><X size={18} /></button>
            </div>
            <div className="space-y-4 py-2">
              <Input label="Contract Name" placeholder="e.g. Service Agreement - Acme Corp" value={newContractName} onChange={(e) => setNewContractName(e.target.value)} autoFocus className="text-lg py-3 bg-white/50" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 bg-white/50">Cancel</Button>
              <Button onClick={handleConfirmCreate} className="px-6 shadow-lg shadow-blue-500/20">Create & Open</Button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

// --- UI HELPERS ---
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Created: "bg-blue-50 text-blue-700 border-blue-100",
    Approved: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Sent: "bg-amber-50 text-amber-700 border-amber-100",
    Signed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Locked: "bg-slate-100 text-slate-600 border-slate-200",
    Revoked: "bg-red-50 text-red-700 border-red-100",
  };
  return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>{status}</span>;
}

function getStatusColor(status: string) {
   if (status === 'Signed' || status === 'Locked') return 'bg-emerald-500';
   if (status === 'Revoked') return 'bg-red-500';
   if (status === 'Sent') return 'bg-amber-500';
   return 'bg-blue-500';
}