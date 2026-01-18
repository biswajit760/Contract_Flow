import { useState } from "react";
import { Blueprint } from "@/app/context/ContractContext";

import { X } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  blueprint: Blueprint | null;
}

export function CreateContractModal({ isOpen, onClose, onConfirm, blueprint }: Props) {
  const [name, setName] = useState("");

  if (!isOpen || !blueprint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">New Contract</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Template: <span className="font-medium text-blue-600">{blueprint.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-1.5 rounded-full hover:bg-red-50">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 py-2">
          <Input 
            label="Contract Name" 
            placeholder={`e.g. ${blueprint.name} - Client Name`} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoFocus 
            className="text-lg py-3 bg-white/50" 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
          <Button variant="outline" onClick={onClose} className="border-slate-200 bg-white/50">Cancel</Button>
          <Button onClick={() => onConfirm(name || blueprint.name)} className="px-6 shadow-lg shadow-blue-500/20">
            Create & Open
          </Button>
        </div>
      </div>
    </div>
  );
}