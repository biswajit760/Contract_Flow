"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ContractStatus } from "@/app/context/ContractContext";

import { Clock, File } from "lucide-react";
import { Button } from "../Button";

// --- SUB-COMPONENT: Status Badge (Private to this file to keep it simple) ---
function StatusBadge({ status }: { status: ContractStatus }) {
  const styles: Record<ContractStatus, string> = {
    Created: "bg-blue-50 text-blue-700 border-blue-100",
    Approved: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Sent: "bg-amber-50 text-amber-700 border-amber-100",
    Signed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Locked: "bg-slate-100 text-slate-600 border-slate-200",
    Revoked: "bg-red-50 text-red-700 border-red-100",
  };
  return <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles[status]}`}>{status}</span>;
}

interface Props {
  contracts: Contract[];
}

export function RecentActivity({ contracts }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "Active" | "Signed" | "Revoked">("All");

  // Filtering Logic
  const filteredContracts = contracts.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Active") return ["Created", "Approved", "Sent"].includes(c.status);
    if (filter === "Signed") return ["Signed", "Locked"].includes(c.status);
    if (filter === "Revoked") return c.status === "Revoked";
    return true;
  });

  return (
    <section className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      
      {/* HEADER & FILTERS */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <p className="text-slate-500 text-sm">Real-time status of your documents.</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
          {["All", "Active", "Signed", "Revoked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                filter === f 
                  ? "bg-white text-slate-800 shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
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
                     <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center"><File size={20} className="opacity-30" /></div>
                     <p>No {filter !== 'All' ? filter.toLowerCase() : ''} contracts found.</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredContracts.slice().reverse().map((contract) => (
                <tr 
                  key={contract.id} 
                  onClick={() => router.push(`/contracts/${contract.id}`)} 
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                >
                  <td className="p-5 pl-8">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{contract.name}</div>
                    <div className="text-xs text-slate-400 mt-1">Template: {contract.blueprintName}</div>
                  </td>
                  <td className="p-5"><StatusBadge status={contract.status} /></td>
                  <td className="p-5 text-slate-500 flex items-center gap-2">
                    <Clock size={14} /> {new Date(contract.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-5 text-right pr-8">
                    <Button variant="secondary" className="text-xs h-9 px-4">Open</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}