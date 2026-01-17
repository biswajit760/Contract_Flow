"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, User } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path 
      ? "text-blue-600 font-bold bg-blue-50" 
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center transition-all relative">
      
      {/* --- 1. LEFT: BRAND LOGO --- */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 transform group-hover:scale-105">
            <Shield size={20} fill="currentColor" className="opacity-90" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            ContractFlow
          </span>
        </Link>
      </div>
      
      {/* --- 2. CENTER: NAVIGATION LINKS --- */}
      {/* Absolute positioning ensures it stays perfectly centered regardless of left/right content width */}
      <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/50 p-1 rounded-xl border border-slate-100 backdrop-blur-sm">
         <Link href="/" className={`text-sm px-4 py-1.5 rounded-lg transition-all duration-200 ${isActive('/')}`}>
           Dashboard
         </Link>
         <Link href="/contracts" className={`text-sm px-4 py-1.5 rounded-lg transition-all duration-200 ${isActive('/contracts')}`}>
           Contracts
         </Link>
         <Link href="/blueprints" className={`text-sm px-4 py-1.5 rounded-lg transition-all duration-200 ${isActive('/blueprints')}`}>
           Blueprints
         </Link>
      </div>
      
      {/* --- 3. RIGHT: USER PROFILE --- */}
      <div className="flex items-center gap-4">
        <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 ring-2 ring-transparent hover:ring-slate-200">
          <User size={18} />
        </button>
      </div>

    </nav>
  );
}