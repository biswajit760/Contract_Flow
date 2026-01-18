"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// FIX 1: Destructure helper
import { useContract, Blueprint, Contract } from "@/app/context/ContractContext"; 

import { NavBar } from "@/components/NavBar";
import { 
  FileText, Plus, PenTool, Calendar, CheckSquare, 
  Search, ArrowRight, LayoutTemplate, X 
} from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function BlueprintsPage() {
  const router = useRouter();
  
  // FIX 2: Use 'createContract' instead of 'dispatch'
  const { blueprints, createContract } = useContract();

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [newContractName, setNewContractName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // --- FILTERING ---
  const filteredBlueprints = blueprints.filter(bp => 
    bp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      // FIX 3: Ensure history is initialized
      history: [{ status: "Created", timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    // FIX 4: Use the helper function
    createContract(newContract);
    
    router.push(`/contracts/${newContractId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <NavBar />

      {/* --- HEADER --- */}
      <div className="bg-slate-900 pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Blueprint Library</h1>
            <p className="text-slate-400 mt-2 text-lg max-w-2xl">
              Manage your reusable contract templates. Define structures once, use them forever.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/blueprints/new")}
            className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/50"
          >
            <Plus size={18} className="mr-2" /> Create New Blueprint
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 space-y-8">

        {/* --- SEARCH BAR --- */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 max-w-md">
          <Search className="text-slate-400 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="flex-1 p-2 outline-none text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- BLUEPRINT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card (First Item) */}
          <div 
            onClick={() => router.push("/blueprints/new")}
            className="bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group min-h-[200px]"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-700 group-hover:text-blue-700">Design New Template</h3>
            <p className="text-xs text-slate-500 mt-1">Start from scratch</p>
          </div>

          {/* Existing Blueprints */}
          {filteredBlueprints.map((bp) => (
            <div key={bp.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <LayoutTemplate size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                    {bp.fields.length} Fields
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {bp.name}
                </h3>
                
                {/* Field Preview Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {bp.fields.slice(0, 3).map((f) => (
                    <div key={f.id} className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                      <FieldIcon type={f.type} size={10} /> {f.label}
                    </div>
                  ))}
                  {bp.fields.length > 3 && (
                    <span className="text-[10px] text-slate-400 py-0.5">+{bp.fields.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleOpenCreateModal(bp)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  Use Template <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- CREATE CONTRACT MODAL (Reused) --- */}
      {isModalOpen && selectedBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 scale-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Contract</h3>
                <p className="text-xs text-slate-500 mt-0.5">Using: <span className="font-medium text-blue-600">{selectedBlueprint.name}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 py-2">
              <Input 
                label="Contract Name" 
                placeholder="e.g. Service Agreement - Acme Corp" 
                value={newContractName}
                onChange={(e) => setNewContractName(e.target.value)} 
                autoFocus
                className="text-lg py-3"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmCreate} className="px-6 shadow-lg shadow-blue-500/20">Create & Open</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- HELPER: Field Icons ---
function FieldIcon({ type, size = 12 }: { type: string, size?: number }) {
  if (type === 'text') return <PenTool size={size} />;
  if (type === 'date') return <Calendar size={size} />;
  if (type === 'checkbox') return <CheckSquare size={size} />;
  if (type === 'signature') return <FileText size={size} />;
  return <FileText size={size} />;
}