"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Link as LinkIcon, Settings, LogOut, Search, Bell } from "lucide-react";
import { mockLogout } from "@/modules/app-portal/services/auth/actions";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex bg-[#F8F9FE] text-slate-800 min-h-screen overflow-hidden font-sans selection:bg-rose-500/30 selection:text-rose-900 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-violet-400/20 blur-[120px] mix-blend-multiply" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-amber-400/20 blur-[120px] mix-blend-multiply" />
            </div>

            {/* Floating Sidebar */}
            <aside className="w-72 flex-shrink-0 z-10 p-6 flex flex-col hidden lg:flex">
                <div className="flex-1 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden relative">
                    {/* Inner glowing effect */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />

                    <div className="flex flex-col h-full p-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10 mt-2 z-10">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 via-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white font-bold text-xl ring-2 ring-white/50">
                                C
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-800">
                                CrowdClip
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2 z-10">
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
                            <NavItem href="/app" icon={<LayoutDashboard size={20} />} label="Overview" active={pathname === '/app'} />
                            <NavItem href="/app/links" icon={<LinkIcon size={20} />} label="Submissions" active={pathname === '/app/links'} />
                            <NavItem href="/app/settings" icon={<Settings size={20} />} label="Settings" active={pathname === '/app/settings'} />
                        </nav>

                        {/* Bottom Action */}
                        <div className="mt-auto z-10 pt-6 border-t border-slate-200/50">
                            <form action={mockLogout}>
                                <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group font-medium">
                                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    <span>Disconnect</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden h-screen">
                {/* Modern Header */}
                <header className="h-24 px-8 flex items-center justify-between shrink-0 top-0 z-20 sticky">
                    {/* Mobile Menu Toggle (hidden on desktop) */}
                    <div className="lg:hidden flex items-center gap-3">
                        <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm">C</div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex relative group max-w-md w-full ml-4">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search submissions..."
                            className="w-full bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl py-3 pl-11 pr-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-sm flex items-center justify-center text-slate-500 hover:text-violet-600 hover:scale-105 active:scale-95 transition-all relative group">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-white shadow-sm p-1.5 pr-4 rounded-2xl hover:bg-white cursor-pointer transition-colors group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-medium shadow-inner group-hover:scale-110 transition-transform">
                                TU
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-slate-800 leading-none">Test User</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Playground */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 pt-0 pb-24">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href}>
            <div
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 relative group cursor-pointer ${active
                        ? "text-violet-700 font-semibold"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50 font-medium"
                    }`}
            >
                {active && (
                    <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 bg-violet-100 rounded-2xl -z-10 border border-violet-200/50 shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <div className={`relative z-10 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                    {icon}
                </div>

                <span className="relative z-10">{label}</span>

                {active && (
                    <motion.div
                        layoutId="nav-active-indicator"
                        className="w-1.5 h-6 rounded-full bg-violet-500 absolute right-2 top-1/2 -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </div>
        </Link>
    );
}
