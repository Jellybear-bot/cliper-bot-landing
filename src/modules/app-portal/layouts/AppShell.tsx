"use client";

import { ReactNode, startTransition, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Settings, LogOut, Search, Bell, Menu, X,
    Megaphone, Video, Wallet, CheckCheck, BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { mockLogout } from "@/modules/app-portal/services/auth/actions";
import { useLanguage } from "@/context/LanguageContext";
import { useCampaigns, useMe, usePayouts, useSubmissions } from "@/lib/portalApi";
import type { CampaignResponse, ClipperResponse, PayoutResponse, SubmissionResponse } from "@/lib/portalApi";
import { FORCE_PORTAL_MOCK_MODE, PORTAL_ROLE_OVERRIDE_ENABLED, shouldUsePortalMockData } from "@/lib/portalConfig";
import { getLocalRoleOverride, setLocalRoleOverride, type PortalRole } from "@/modules/app-portal/roleConfig";
import { MOCK_CAMPAIGNS, MOCK_CLIPPER, MOCK_PAYOUTS, MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";

interface Notification {
    id: string;
    type: "campaign" | "payout" | "system";
    title: string;
    desc: string;
    time: string;
    createdAt: string;
    read: boolean;
    href?: string;
}

const TYPE_ICON: Record<Notification["type"], string> = {
    campaign: "📢",
    payout: "💰",
    system: "🔔",
};

const READ_NOTIFICATIONS_KEY = "portal_read_notifications";

function formatNotificationTime(value: string, language: "th" | "en") {
    const locale = language === "th" ? "th-TH" : "en-US";
    return new Date(value).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function buildNotifications({
    language,
    campaigns,
    submissions,
    payouts,
}: {
    language: "th" | "en";
    campaigns: CampaignResponse[];
    submissions: SubmissionResponse[];
    payouts: PayoutResponse[];
}) {
    const notifications: Notification[] = [];

    for (const campaign of campaigns
        .filter((item) => item.status.includes("🟢"))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)) {
        notifications.push({
            id: `campaign:${campaign.id}`,
            type: "campaign",
            title: language === "th"
                ? `แคมเปญใหม่: ${campaign.campaign_name}`
                : `New campaign: ${campaign.campaign_name}`,
            desc: language === "th"
                ? `${campaign.client_name} เปิดรับแล้ว อัตรา ฿${campaign.cost_per_thousand_views} / 1K views`
                : `${campaign.client_name} is now active at ฿${campaign.cost_per_thousand_views} per 1K views.`,
            time: formatNotificationTime(campaign.created_at, language),
            createdAt: campaign.created_at,
            read: false,
            href: "/app/campaigns",
        });
    }

    for (const submission of [...submissions]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)) {
        notifications.push({
            id: `submission:${submission.id}`,
            type: "system",
            title: language === "th"
                ? `อัปเดตวิดีโอ: ${submission.campaign_name}`
                : `Submission update: ${submission.campaign_name}`,
            desc: language === "th"
                ? `${submission.status} • ${submission.video_url.replace("https://", "")}`
                : `${submission.status} • ${submission.video_url.replace("https://", "")}`,
            time: formatNotificationTime(submission.created_at, language),
            createdAt: submission.created_at,
            read: false,
            href: "/app/submissions",
        });
    }

    for (const payout of [...payouts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 1)) {
        notifications.push({
            id: `payout:${payout.id}`,
            type: "payout",
            title: language === "th"
                ? `สถานะการถอนเงิน: ${payout.status}`
                : `Payout status: ${payout.status}`,
            desc: language === "th"
                ? `ยอด ฿${payout.amount.toLocaleString("th-TH")} ไปยัง ${payout.bank_type}`
                : `Amount ฿${payout.amount.toLocaleString("en-US")} to ${payout.bank_type}.`,
            time: formatNotificationTime(payout.created_at, language),
            createdAt: payout.created_at,
            read: false,
            href: "/app/withdraw",
        });
    }

    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function mergeReadIds(current: string[], incoming: string[]) {
    return Array.from(new Set([...current, ...incoming]));
}

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [roleOverride, setRoleOverride] = useState<PortalRole | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
    const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
    const notiRef = useRef<HTMLDivElement>(null);

    const { t, language, setLanguage } = useLanguage();
    const a = t.app;

    const { data: me, loading: meLoading, error: meError } = useMe();
    const { data: campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns();
    const { data: submissions, loading: submissionsLoading, error: submissionsError } = useSubmissions();
    const { data: payouts, loading: payoutsLoading, error: payoutsError } = usePayouts();

    const shouldMockMe = shouldUsePortalMockData(Boolean(meError) && !meLoading);
    const shouldMockCampaigns = shouldUsePortalMockData(Boolean(campaignsError) && !campaignsLoading);
    const shouldMockSubmissions = shouldUsePortalMockData(Boolean(submissionsError) && !submissionsLoading);
    const shouldMockPayouts = shouldUsePortalMockData(Boolean(payoutsError) && !payoutsLoading);

    const clipperData = shouldMockMe ? MOCK_CLIPPER : (me ?? null);
    const campaignData = shouldMockCampaigns ? MOCK_CAMPAIGNS : (campaigns ?? []);
    const submissionData = shouldMockSubmissions ? MOCK_SUBMISSIONS : (submissions ?? []);
    const payoutData = shouldMockPayouts ? MOCK_PAYOUTS : (payouts ?? []);

    const notifications = buildNotifications({
        language,
        campaigns: campaignData,
        submissions: submissionData,
        payouts: payoutData,
    }).map((notification) => ({
        ...notification,
        read: readNotificationIds.includes(notification.id),
    }));

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    useEffect(() => {
        setSearchQuery(searchParams.get("q") ?? "");
    }, [searchParams]);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
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

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(READ_NOTIFICATIONS_KEY);
            if (!raw) return;

            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setReadNotificationIds(parsed.filter((value): value is string => typeof value === "string"));
            }
        } catch {
            setReadNotificationIds([]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(readNotificationIds));
    }, [readNotificationIds]);

    function handleSetRole(role: PortalRole) {
        setLocalRoleOverride(roleOverride === role ? null : role);
    }

    function handleSearchChange(value: string) {
        setSearchQuery(value);

        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set("q", value);
        } else {
            params.delete("q");
        }

        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        startTransition(() => {
            router.replace(nextUrl);
        });
    }

    function markAllRead() {
        setReadNotificationIds((current) => mergeReadIds(current, notifications.map((notification) => notification.id)));
    }

    function markNotificationRead(id: string) {
        setReadNotificationIds((current) => mergeReadIds(current, [id]));
        setIsNotiOpen(false);
    }

    const NAV_ITEMS = [
<<<<<<< HEAD
        { href: "/app", icon: <LayoutDashboard size={20} />, label: a.nav.overview },
        { href: "/app/campaigns", icon: <Megaphone size={20} />, label: a.nav.campaigns },
        { href: "/app/earnings", icon: <BarChart3 size={20} />, label: a.nav.earnings },
        { href: "/app/submissions", icon: <Video size={20} />, label: a.nav.submissions },
        { href: "/app/withdraw", icon: <Wallet size={20} />, label: a.nav.withdraw },
        { href: "/app/settings", icon: <Settings size={20} />, label: a.nav.settings },
=======
        { href: '/app/overview', icon: <LayoutDashboard size={20} />, label: a.nav.overview },
        { href: '/app/campaigns', icon: <Megaphone size={20} />, label: a.nav.campaigns },
        { href: '/app/earnings', icon: <BarChart3 size={20} />, label: a.nav.earnings },
        { href: '/app/submissions', icon: <Video size={20} />, label: a.nav.submissions },
        { href: '/app/withdraw', icon: <Wallet size={20} />, label: a.nav.withdraw },
        { href: '/app/settings', icon: <Settings size={20} />, label: a.nav.settings },
>>>>>>> 9ba872192daa73fac8ebe732fb6cd2ac3ca33c3e
    ];

    const profileName = clipperData?.username ?? "Portal User";
    const profileStatus = clipperData?.status ?? (FORCE_PORTAL_MOCK_MODE ? "Mock Mode" : "Connecting");
    const profileInitials = profileName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((value) => value[0]?.toUpperCase() ?? "")
        .join("") || "PU";

    return (
        <div className="flex bg-[#F8FAFC] text-slate-900 h-screen overflow-hidden font-sans">
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

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
            >
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

                <div className="p-4 border-t border-slate-100 shrink-0">
                    <form action={mockLogout}>
                        <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group font-medium text-sm">
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>{a.common.signOut}</span>
                        </button>
                    </form>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
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
                                value={searchQuery}
                                onChange={(event) => handleSearchChange(event.target.value)}
                                placeholder={a.common.searchPlaceholder}
                                className="w-80 bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {PORTAL_ROLE_OVERRIDE_ENABLED && (
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
                        )}

                        <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                            <button
                                onClick={() => setLanguage("th")}
                                className={`px-3 py-1.5 text-xs font-bold transition-all ${language === "th" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-3 py-1.5 text-xs font-bold transition-all ${language === "en" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                EN
                            </button>
                        </div>

                        <div className="relative" ref={notiRef}>
                            <button
                                onClick={() => setIsNotiOpen((value) => !value)}
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
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-800 text-sm">
                                                    {language === "th" ? "การแจ้งเตือน" : "Notifications"}
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                                                        {unreadCount} {language === "th" ? "ใหม่" : "new"}
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <CheckCheck size={13} /> {language === "th" ? "อ่านทั้งหมด" : "Mark all read"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                            {notifications.length === 0 ? (
                                                <p className="px-4 py-8 text-center text-sm text-slate-400">
                                                    {language === "th" ? "ยังไม่มีการแจ้งเตือน" : "No notifications yet"}
                                                </p>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <NotiItem
                                                        key={notification.id}
                                                        noti={notification}
                                                        onRead={() => markNotificationRead(notification.id)}
                                                    />
                                                ))
                                            )}
                                        </div>

                                        <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                                            <p className="text-[11px] text-slate-400 font-medium">
                                                {language === "th" ? "อ้างอิงจากข้อมูลพอร์ทัลล่าสุด" : "Built from the latest portal data"}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                        <div className="flex items-center gap-3 cursor-pointer group rounded-lg hover:bg-slate-50 p-1.5 pr-2 transition-colors">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-slate-700 leading-none mb-1">{profileName}</p>
                                <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider leading-none">{profileStatus}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                                {profileInitials}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto w-full">
                    <div className="w-full p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

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
