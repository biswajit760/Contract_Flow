"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Search,
  Bell,
  PlusCircle
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ContractFlow
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem
            href="/"
            icon={LayoutDashboard}
            label="Dashboard"
            active={pathname === "/"}
          />
          {/* Note: We point these to / for now as those pages don't exist yet */}
          <NavItem
            href="/" 
            icon={FileText}
            label="Contracts"
            active={pathname.startsWith("/contracts")}
          />
           <NavItem
            href="/blueprints/new"
            icon={PlusCircle}
            label="New Blueprint"
            active={pathname.startsWith("/blueprints")}
          />
        </nav>

        {/* USER CARD */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                DU
            </div>
            <div className="text-sm leading-tight">
              <p className="font-bold text-slate-700">Demo User</p>
              <p className="text-xs text-slate-500">Admin Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8">
          <div className="flex items-center gap-3 text-slate-400">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-64 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 border-2 border-white" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <section className="flex-1 overflow-auto bg-slate-50/50 p-6 md:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

/* ================= NAV ITEM ================= */

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${
          active
            ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}