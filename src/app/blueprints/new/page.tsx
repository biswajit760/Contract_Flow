"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContract, FieldDefinition } from "@/app/context/ContractContext";
import { NavBar } from "@/components/NavBar";
import { 
  Trash2, Plus, FileText, Calendar, CheckSquare, 
  PenTool, GripVertical, Save, ArrowLeft, LayoutTemplate,
  ChevronUp, ChevronDown 
} from "lucide-react";

export default function CreateBlueprintPage() {
  const router = useRouter();
  
  // FIX: Destructure 'addBlueprint' instead of 'dispatch'
  const { addBlueprint } = useContract();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<FieldDefinition[]>([]);

  // Add a new field
  const addField = (type: FieldDefinition["type"]) => {
    const newField: FieldDefinition = {
      id: crypto.randomUUID(),
      type,
      label: "",
    };
    setFields([...fields, newField]);
  };

  // Update field label
  const updateFieldLabel = (id: string, text: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, label: text } : f));
  };

  // Remove field
  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  // --- REORDERING LOGIC ---
  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    
    if (direction === 'up' && index > 0) {
      // Swap with previous
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      // Swap with next
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    }
    
    setFields(newFields);
  };

  // Save Blueprint
  const handleSave = () => {
    if (!name.trim()) return alert("Please give your blueprint a title.");
    if (fields.length === 0) return alert("Please add at least one field.");

    // --- CRITICAL: Satisfies "Store field metadata: Position" ---
    // We map over the array and assign 'position' based on the current index
    const fieldsWithPosition = fields.map((f, index) => ({
      ...f,
      position: index + 1 // 1-based index (1, 2, 3...)
    }));

    // FIX: Use the helper function directly
    addBlueprint({
      id: crypto.randomUUID(),
      name,
      fields: fieldsWithPosition,
    });

    router.push("/blueprints"); // Or back to dashboard
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 antialiased">
      
      {/* 1. Main Navbar */}
      <NavBar />

      {/* 2. Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => router.push("/blueprints")}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Blueprint Builder 
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                Draft
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => router.push("/blueprints")}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleSave} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all font-semibold text-sm"
            >
              <Save size={18} /> Save Template
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
        
          {/* --- LEFT SIDEBAR: TOOLBOX --- */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Add Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <ToolButton icon={<FileText size={18} className="text-blue-500"/>} label="Text Field" onClick={() => addField("text")} />
                <ToolButton icon={<Calendar size={18} className="text-purple-500"/>} label="Date Picker" onClick={() => addField("date")} />
                <ToolButton icon={<CheckSquare size={18} className="text-emerald-500"/>} label="Checkbox" onClick={() => addField("checkbox")} />
                <ToolButton icon={<PenTool size={18} className="text-amber-500"/>} label="Signature" onClick={() => addField("signature")} />
              </div>
            </div>
          </div>

          {/* --- RIGHT PANEL: DOCUMENT CANVAS --- */}
          <div className="flex-1 w-full">
            <div className="bg-white min-h-[800px] shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200 flex flex-col">
              
              {/* Gradient Top */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <div className="p-8 md:p-12 flex-1 flex flex-col">
                
                {/* Document Title */}
                <div className="mb-10 group relative">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 ml-1">Document Title</label>
                  <input 
                    type="text" 
                    placeholder="Untitled Blueprint"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-3xl md:text-4xl font-serif font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent border-b-2 border-transparent focus:border-blue-500 transition-all py-2"
                  />
                  <div className="absolute top-8 -left-8 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                    <LayoutTemplate size={24} />
                  </div>
                </div>

                {/* Dynamic Fields Area */}
                <div className="space-y-4 flex-1">
                  {fields.length === 0 ? (
                    <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                      <Plus size={32} className="opacity-20 mb-2" />
                      <p className="font-medium">Canvas Empty</p>
                      <p className="text-sm">Add fields from the toolbox</p>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div key={field.id} className="group flex gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all">
                        
                        {/* 1. Drag Handle (Visual) */}
                        <div className="pt-3 text-slate-300 cursor-grab active:cursor-grabbing">
                           <GripVertical size={20} />
                        </div>

                        {/* 2. Main Content */}
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                             <TypeIcon type={field.type} />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                               {field.type} Field
                             </span>
                           </div>
                           <input
                             type="text"
                             value={field.label}
                             onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                             className="w-full bg-transparent text-lg font-medium text-slate-800 placeholder:text-slate-400 border-b border-dashed border-slate-300 focus:border-blue-500 focus:border-solid outline-none py-1 transition-all"
                             placeholder={`Enter question for this ${field.type}...`}
                             autoFocus={!field.label} 
                           />
                        </div>

                        {/* 3. Actions Column (Move & Delete) */}
                        <div className="flex flex-col gap-1 border-l border-slate-100 pl-3 ml-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                            {/* MOVE UP */}
                            <button 
                              onClick={() => moveField(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-500 hover:text-blue-600 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ChevronUp size={16} />
                            </button>

                            {/* MOVE DOWN */}
                            <button 
                              onClick={() => moveField(index, 'down')}
                              disabled={index === fields.length - 1}
                              className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-500 hover:text-blue-600 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ChevronDown size={16} />
                            </button>

                            <div className="h-px bg-slate-200 my-1"></div>
                            
                            {/* DELETE */}
                            <button 
                              onClick={() => removeField(field.id)}
                              className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded text-slate-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Footer Watermark */}
                <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300 font-mono uppercase">
                  <span>ContractFlow Builder</span>
                  <span>1 of 1</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ToolButton({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-500/30 hover:shadow-md transition-all text-left"
    >
      <div className="bg-slate-50 p-2 rounded-md">
        {icon}
      </div>
      <span className="font-bold text-slate-700 text-sm">{label}</span>
      <Plus size={16} className="ml-auto text-blue-500 opacity-0 hover:opacity-100" />
    </button>
  );
}

function TypeIcon({ type }: { type: string }) {
  const icons: any = {
    text: <FileText size={14} className="text-blue-500"/>,
    date: <Calendar size={14} className="text-purple-500"/>,
    checkbox: <CheckSquare size={14} className="text-emerald-500"/>,
    signature: <PenTool size={14} className="text-amber-500"/>,
  };
  return icons[type] || icons.text;
}