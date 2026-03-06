"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Settings, LogOut, Search, Bell, Menu, X,
    Megaphone, Video, Wallet, CheckCheck, BarChart3
} from "lucide-react";
import { mockLogout } from "@/modules/app-portal/services/auth/actions";
import { useLanguage } from "@/context/LanguageContext";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocalRoleOverride, setLocalRoleOverride, type PortalRole } from "@/modules/app-portal/roleConfig";

// ─── Mock Notifications ───────────────────────────────────────────────────────

interface Notification {
    id: number;
    type: "campaign" | "payout" | "system";
    title: string;
    desc: string;
    time: string;
    read: boolean;
    href?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: "campaign",
        title: "แคมเปญใหม่มาแล้ว! 🎉",
        desc: "แคมเปญ \"Samsung Galaxy S25\" เปิดรับคลิปเปอร์แล้ว อัตรา ฿80 / 1K views",
        time: "เมื่อกี้",
        read: false,
        href: "/app/campaigns",
    },
    {
        id: 2,
        type: "campaign",
        title: "แคมเปญใหม่มาแล้ว! 🎉",
        desc: "แคมเปญ \"AirAsia Summer Sale\" เปิดรับสมัครแล้ว งบประมาณ ฿50,000",
        time: "2 ชม. ที่แล้ว",
        read: false,
        href: "/app/campaigns",
    },
    {
        id: 3,
        type: "payout",
        title: "คำขอถอนเงินสำเร็จ ✅",
        desc: "ยอดถอน ฿5,000 โอนเข้าบัญชีของคุณเรียบร้อยแล้ว",
        time: "เมื่อวาน",
        read: true,
    },
    {
        id: 4,
        type: "system",
        title: "วิดีโอของคุณผ่านการรีวิว",
        desc: "วิดีโอ tiktok.com/@you/video/123 ได้รับสถานะ Active แล้ว",
        time: "3 วันที่แล้ว",
        read: true,
        href: "/app/submissions",
    },
];

const TYPE_ICON: Record<Notification["type"], string> = {
    campaign: "📢",
    payout: "💰",
    system: "🔔",
};

// ─── Shell ────────────────────────────────────────────────────────────────────

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [roleOverride, setRoleOverride] = useState<PortalRole | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const notiRef = useRef<HTMLDivElement>(null);

    const { t, language, setLanguage } = useLanguage();
    const a = t.app;

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
                setIsNotiOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        const syncRole = () => setRoleOverride(getLocalRoleOverride());
        syncRole();
        window.addEventListener("portal-role-updated", syncRole);
        window.addEventListener("storage", syncRole);
        return () => {
            window.removeEventListener("portal-role-updated", syncRole);
            window.removeEventListener("storage", syncRole);
        };
    }, []);

    function handleSetRole(role: PortalRole) {
        setLocalRoleOverride(roleOverride === role ? null : role);
    }

    function markAllRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    const NAV_ITEMS = [
        { href: '/app/overview', icon: <LayoutDashboard size={20} />, label: a.nav.overview },
        { href: '/app/campaigns', icon: <Megaphone size={20} />, label: a.nav.campaigns },
        { href: '/app/earnings', icon: <BarChart3 size={20} />, label: a.nav.earnings },
        { href: '/app/submissions', icon: <Video size={20} />, label: a.nav.submissions },
        { href: '/app/withdraw', icon: <Wallet size={20} />, label: a.nav.withdraw },
        { href: '/app/settings', icon: <Settings size={20} />, label: a.nav.settings },
    ];

    return (
        <div className="flex bg-[#F8FAFC] text-slate-900 h-screen overflow-hidden font-sans">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-sm">
                            C
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">CrowdClip</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        {a.common.menu}
                    </p>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                active={pathname === item.href}
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        ))}
                    </nav>
                </div>

                {/* Sign Out */}
                <div className="p-4 border-t border-slate-100 shrink-0">
                    <form action={mockLogout}>
                        <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group font-medium text-sm">
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>{a.common.signOut}</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:flex relative group max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder={a.common.searchPlaceholder}
                                className="w-80 bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Local Role Switcher */}
                        <div className="hidden md:flex items-center gap-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
                            <button
                                onClick={() => handleSetRole("member")}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${roleOverride === "member" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-700"}`}
                                title="Switch local test role to member"
                            >
                                MEMBER
                            </button>
                            <button
                                onClick={() => handleSetRole("vip")}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${roleOverride === "vip" ? "bg-amber-500 text-white" : "text-slate-500 hover:text-slate-700"}`}
                                title="Switch local test role to vip"
                            >
                                VIP
                            </button>
                        </div>

                        {/* Language Toggle */}
                        <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-3 py-1.5 text-xs font-bold transition-all ${language === 'th' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 text-xs font-bold transition-all ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Notification Bell */}
                        <div className="relative" ref={notiRef}>
                            <button
                                onClick={() => setIsNotiOpen((v) => !v)}
                                className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white leading-none">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotiOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-800 text-sm">การแจ้งเตือน</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                                                        {unreadCount} ใหม่
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <CheckCheck size={13} /> อ่านทั้งหมด
                                                </button>
                                            )}
                                        </div>

                                        {/* List */}
                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                            {notifications.map((n) => (
                                                <NotiItem
                                                    key={n.id}
                                                    noti={n}
                                                    onRead={() => {
                                                        setNotifications((prev) =>
                                                            prev.map((x) => x.id === n.id ? { ...x, read: true } : x)
                                                        );
                                                        setIsNotiOpen(false);
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                                            <p className="text-[11px] text-slate-400 font-medium">แสดงการแจ้งเตือน 30 วันล่าสุด</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                        <div className="flex items-center gap-3 cursor-pointer group rounded-lg hover:bg-slate-50 p-1.5 pr-2 transition-colors">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-slate-700 leading-none mb-1">Test Creator</p>
                                <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider leading-none">🟢 Active</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                                TC
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="w-full p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// ─── Notification Item ────────────────────────────────────────────────────────

function NotiItem({ noti, onRead }: { noti: Notification; onRead: () => void }) {
    const content = (
        <div
            onClick={onRead}
            className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-slate-50 ${!noti.read ? "bg-blue-50/40" : ""}`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5 ${noti.type === "campaign" ? "bg-blue-100" : noti.type === "payout" ? "bg-emerald-100" : "bg-slate-100"}`}>
                {TYPE_ICON[noti.type]}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!noti.read ? "font-bold text-slate-800" : "font-semibold text-slate-700"}`}>
                    {noti.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{noti.desc}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{noti.time}</p>
            </div>
            {!noti.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
            )}
        </div>
    );

    return noti.href ? <Link href={noti.href}>{content}</Link> : <>{content}</>;
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({ href, icon, label, active, onClick }: {
    href: string;
    icon: ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <Link href={href} onClick={onClick}>
            <div className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all duration-200 relative group cursor-pointer ${active
                ? "text-blue-700 font-semibold bg-blue-50/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}>
                <div className={`transition-colors duration-200 ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {icon}
                </div>
                <span className="text-sm">{label}</span>
                {active && (
                    <motion.div
                        layoutId="nav-active-indicator"
                        className="w-1 h-5 rounded-r-full bg-blue-600 absolute left-0 top-1/2 -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </div>
        </Link>
    );
}
