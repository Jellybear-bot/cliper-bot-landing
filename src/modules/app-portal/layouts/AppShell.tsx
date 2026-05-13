"use client";

import { ReactNode, startTransition, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck, Sun, Moon, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { mockLogout } from "@/modules/app-portal/services/auth/actions";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCampaigns, useMe, usePayouts, useSubmissions } from "@/lib/portalApi";
import type { CampaignResponse, PayoutResponse, SubmissionResponse } from "@/lib/portalApi";
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
    return new Date(value).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

function buildNotifications({ language, campaigns, submissions, payouts }: {
    language: "th" | "en";
    campaigns: CampaignResponse[];
    submissions: SubmissionResponse[];
    payouts: PayoutResponse[];
}) {
    const notifications: Notification[] = [];

    for (const campaign of campaigns.filter((c) => c.status.includes("🟢"))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2)) {
        notifications.push({
            id: `campaign:${campaign.id}`, type: "campaign",
            title: language === "th" ? `แคมเปญใหม่: ${campaign.campaign_name}` : `New campaign: ${campaign.campaign_name}`,
            desc: language === "th"
                ? `${campaign.client_name} เปิดรับแล้ว อัตรา ฿${campaign.cost_per_thousand_views} / 1K views`
                : `${campaign.client_name} is now active at ฿${campaign.cost_per_thousand_views} per 1K views.`,
            time: formatNotificationTime(campaign.created_at, language),
            createdAt: campaign.created_at, read: false, href: "/app/campaigns",
        });
    }

    for (const sub of [...submissions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2)) {
        notifications.push({
            id: `submission:${sub.id}`, type: "system",
            title: language === "th" ? `อัปเดตวิดีโอ: ${sub.campaign_name}` : `Submission update: ${sub.campaign_name}`,
            desc: `${sub.status} • ${sub.video_url.replace("https://", "")}`,
            time: formatNotificationTime(sub.created_at, language),
            createdAt: sub.created_at, read: false, href: "/app/submissions",
        });
    }

    for (const payout of [...payouts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 1)) {
        notifications.push({
            id: `payout:${payout.id}`, type: "payout",
            title: language === "th" ? `สถานะการถอนเงิน: ${payout.status}` : `Payout status: ${payout.status}`,
            desc: language === "th"
                ? `ยอด ฿${payout.amount.toLocaleString("th-TH")} ไปยัง ${payout.bank_type}`
                : `Amount ฿${payout.amount.toLocaleString("en-US")} to ${payout.bank_type}.`,
            time: formatNotificationTime(payout.created_at, language),
            createdAt: payout.created_at, read: false, href: "/app/withdraw",
        });
    }

    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const mergeReadIds = (current: string[], incoming: string[]) => Array.from(new Set([...current, ...incoming]));

// Nav tabs order matching var-a.jsx exactly
const TOP_NAV_KEYS = ["overview", "campaigns", "submissions", "earnings", "withdraw", "settings"] as const;
type NavKey = typeof TOP_NAV_KEYS[number];

const NAV_HREFS: Record<NavKey, string> = {
    overview: "/app/overview",
    campaigns: "/app/campaigns",
    submissions: "/app/submissions",
    earnings: "/app/earnings",
    withdraw: "/app/withdraw",
    settings: "/app/settings",
};

function pathnameToNavKey(pathname: string): NavKey | null {
    for (const key of TOP_NAV_KEYS) {
        if (pathname === NAV_HREFS[key] || pathname.startsWith(NAV_HREFS[key] + "/")) {
            return key;
        }
    }
    return null;
}

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [roleOverride, setRoleOverride] = useState<PortalRole | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
    const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
    const notiRef = useRef<HTMLDivElement>(null);

    const { t, language, setLanguage } = useLanguage();
    const { isDark, toggle: toggleDark } = useTheme();
    const a = t.app;

    const activeTab = pathnameToNavKey(pathname);

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

    const notifications = buildNotifications({ language, campaigns: campaignData, submissions: submissionData, payouts: payoutData })
        .map((n) => ({ ...n, read: readNotificationIds.includes(n.id) }));
    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => { setSearchQuery(searchParams.get("q") ?? ""); }, [searchParams]);
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (notiRef.current && !notiRef.current.contains(e.target as Node)) setIsNotiOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    useEffect(() => {
        const sync = () => setRoleOverride(getLocalRoleOverride());
        sync();
        window.addEventListener("portal-role-updated", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("portal-role-updated", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(READ_NOTIFICATIONS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setReadNotificationIds(parsed.filter((v): v is string => typeof v === "string"));
        } catch { setReadNotificationIds([]); }
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
        if (value.trim()) params.set("q", value); else params.delete("q");
        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        startTransition(() => { router.replace(nextUrl); });
    }

    function markAllRead() {
        setReadNotificationIds((c) => mergeReadIds(c, notifications.map((n) => n.id)));
    }
    function markNotificationRead(id: string) {
        setReadNotificationIds((c) => mergeReadIds(c, [id]));
        setIsNotiOpen(false);
    }

    const profileName = clipperData?.username ?? "Portal User";
    const profileStatus = clipperData?.status ?? (FORCE_PORTAL_MOCK_MODE ? "Mock Mode" : "Connecting");
    const profileInitials = profileName.split(/\s+/).filter(Boolean).slice(0, 2)
        .map((v) => v[0]?.toUpperCase() ?? "").join("") || "PU";
    const isVip = profileStatus.toLowerCase().includes("vip") || (clipperData?.payment_info ?? "").toLowerCase().includes("role:vip");

    const navLabels: Record<NavKey, string> = {
        overview: a.nav.overview,
        campaigns: a.nav.campaigns,
        submissions: a.nav.submissions,
        earnings: a.nav.earnings,
        withdraw: a.nav.withdraw,
        settings: a.nav.settings,
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100">
            {/* TOP NAV — Desktop */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08]">
                <div className="px-8 h-16 flex items-center justify-between">
                    {/* Left: logo + nav tabs */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link href="/app/overview" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-600/30">
                                C
                            </div>
                            <span className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100">ClipHunter</span>
                        </Link>

                        {/* Desktop nav tabs — hidden on mobile */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {TOP_NAV_KEYS.map((key) => (
                                <Link
                                    key={key}
                                    href={NAV_HREFS[key]}
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                                        activeTab === key
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                    }`}
                                >
                                    {navLabels[key]}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right: search + controls + bell + user */}
                    <div className="flex items-center gap-3">
                        {/* Search input — hidden on small mobile */}
                        <div className="relative hidden sm:block">
                            <input
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={a.common.searchPlaceholder}
                                className="h-9 w-56 pl-9 pr-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-transparent text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-white/10 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
                            />
                            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>

                        {/* Lang switcher */}
                        <div className="hidden sm:flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                            <button onClick={() => setLanguage("th")} className={`px-2.5 py-1 text-xs font-bold transition-all ${language === "th" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>TH</button>
                            <button onClick={() => setLanguage("en")} className={`px-2.5 py-1 text-xs font-bold transition-all ${language === "en" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>EN</button>
                        </div>

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDark}
                            className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                            title={isDark ? "Light mode" : "Dark mode"}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>


                        {/* Bell */}
                        <div className="relative" ref={notiRef}>
                            <button
                                onClick={() => setIsNotiOpen((v) => !v)}
                                className="relative w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0B0F1A]" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isNotiOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="fixed sm:absolute inset-x-2 sm:inset-x-auto sm:right-0 top-[65px] sm:top-full sm:mt-2 sm:w-96 bg-white dark:bg-slate-900/95 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-black/50 overflow-hidden z-50"
                                    >
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.08]">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                                    {language === "th" ? "การแจ้งเตือน" : "Notifications"}
                                                </h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                                                        {unreadCount} {language === "th" ? "ใหม่" : "new"}
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                                    <CheckCheck size={13} /> {language === "th" ? "อ่านทั้งหมด" : "Mark all read"}
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-white/5">
                                            {notifications.length === 0 ? (
                                                <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                                    {language === "th" ? "ยังไม่มีการแจ้งเตือน" : "No notifications yet"}
                                                </p>
                                            ) : (
                                                notifications.map((n) => (
                                                    <NotiItem key={n.id} noti={n} onRead={() => markNotificationRead(n.id)} />
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                        {/* User avatar + name */}
                        <Link href="/app/settings" className="flex items-center gap-2.5 cursor-pointer group rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 p-1 pr-2 transition-colors">
                            <div className="text-right leading-tight">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{profileName}</p>
                                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    {isVip ? "VIP" : "Member"}
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow">
                                {profileInitials}
                            </div>
                        </Link>

                        {/* Sign out (mobile hidden, accessible via settings) */}
                        <form action={mockLogout} className="hidden">
                            <button type="submit" />
                        </form>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="w-full pb-20 lg:pb-0">
                <div className="px-4 sm:px-8 py-8 max-w-[1280px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile bottom tab bar — visible only on small screens */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-white dark:bg-[#0B0F1A]/95 border-t border-slate-100 dark:border-white/10 backdrop-blur-xl flex justify-around">
                {/* Home */}
                <MobileTab
                    href="/app/overview"
                    active={pathname === "/app/overview"}
                    label={language === "th" ? "ภาพรวม" : "Overview"}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 12 12 3l9 9M5 10v10h14V10" />
                        </svg>
                    }
                />
                {/* Campaigns */}
                <MobileTab
                    href="/app/campaigns"
                    active={pathname === "/app/campaigns"}
                    label={language === "th" ? "แคมเปญ" : "Campaigns"}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 11l18-5v12L3 13z" />
                        </svg>
                    }
                />
                {/* Submit FAB — center */}
                <Link href="/app/submissions" className="flex flex-col items-center gap-0.5 relative -mt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                        <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                </Link>
                {/* Earnings */}
                <MobileTab
                    href="/app/earnings"
                    active={pathname === "/app/earnings"}
                    label={language === "th" ? "รายได้" : "Earnings"}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 3v18h18M7 14l4-4 4 4 5-5" />
                        </svg>
                    }
                />
                {/* Profile / Settings */}
                <MobileTab
                    href="/app/settings"
                    active={pathname === "/app/settings"}
                    label={language === "th" ? "ฉัน" : "Me"}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                    }
                />
            </nav>
        </div>
    );
}

function MobileTab({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: React.ReactNode }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-0.5 px-3 py-1">
            <span className={active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}>{icon}</span>
            <span className={`text-[9px] font-bold ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}>{label}</span>
        </Link>
    );
}

function NotiItem({ noti, onRead }: { noti: Notification; onRead: () => void }) {
    const content = (
        <div onClick={onRead} className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${!noti.read ? "bg-blue-50/40 dark:bg-blue-500/10" : ""}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5 ${noti.type === "campaign" ? "bg-blue-100 dark:bg-blue-500/20" : noti.type === "payout" ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-white/10"}`}>{TYPE_ICON[noti.type]}</div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!noti.read ? "font-bold text-slate-800 dark:text-slate-100" : "font-semibold text-slate-700 dark:text-slate-200"}`}>{noti.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{noti.desc}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">{noti.time}</p>
            </div>
            {!noti.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
        </div>
    );
    return noti.href ? <Link href={noti.href}>{content}</Link> : <>{content}</>;
}
