"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// FIX 1: Import helpers we need
import { useContract, Blueprint, Contract } from "@/app/context/ContractContext";
import { NavBar } from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
// Assuming you created these components in the previous step
import { BlueprintGrid } from "@/components/dashboard/BlueprintGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CreateContractModal } from "@/components/dashboard/CreateContractModal";

export default function DashboardPage() {
  const router = useRouter();
  
  // FIX 2: Destructure 'createContract' instead of 'dispatch'
  const { blueprints, contracts, createContract } = useContract(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  // --- HANDLERS ---
  const handleOpenModal = (bp: Blueprint) => {
    setSelectedBlueprint(bp);
    setIsModalOpen(true);
  };

  const handleCreateContract = (name: string) => {
    if (!selectedBlueprint) return;
    
    const newContractId = crypto.randomUUID();
    
    // Create the object
    const newContract: Contract = {
      id: newContractId,
      blueprintId: selectedBlueprint.id,
      blueprintName: selectedBlueprint.name,
      name: name,
      status: "Created",
      formData: {},
      // CRITICAL: Initialize history so the Audit Trail works immediately
      history: [{ status: "Created", timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };

    // FIX 3: Use the helper function
    createContract(newContract);
    
    setIsModalOpen(false);
    router.push(`/contracts/${newContractId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans text-slate-900 pb-20">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <NavBar />
        <HeroSection />

        <main className="max-w-7xl mx-auto px-6 space-y-16 mt-8">
          
          {/* SECTION 1: BLUEPRINTS */}
          <BlueprintGrid 
            blueprints={blueprints} 
            onSelect={handleOpenModal} 
          />

          {/* SECTION 2: ACTIVITY TABLE */}
          <RecentActivity 
            contracts={contracts} 
          />

        </main>
      </div>

      {/* MODAL OVERLAY */}
      <CreateContractModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleCreateContract} 
        blueprint={selectedBlueprint} 
      />
    </div>
  );
}

// Background Visuals
function BackgroundEffects() {
  return (
    <>
      <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[10%] -right-[10%] w-[50rem] h-[50rem] bg-blue-100/50 rounded-full blur-[100px] animate-float mix-blend-multiply" />
         <div className="absolute top-[20%] -left-[10%] w-[40rem] h-[40rem] bg-purple-100/50 rounded-full blur-[100px] animate-float mix-blend-multiply" style={{ animationDelay: '3s' }} />
      </div>
      <style jsx>{`
        @keyframes float { 0% { transform: translate(0,0) } 33% { transform: translate(30px, -50px) } 100% { transform: translate(0,0) } }
        .animate-float { animation: float 10s ease-in-out infinite; }
      `}</style>
    </>
  )
}