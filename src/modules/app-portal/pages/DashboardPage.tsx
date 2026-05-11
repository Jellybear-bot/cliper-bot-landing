"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Wallet, TrendingUp, Megaphone, Video, ArrowRight, Eye, BadgeDollarSign,
    Clock, CheckCircle2, ChevronRight, Sparkles, ArrowDownToLine,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCampaigns, useMe, usePayouts, useSubmissions } from "@/lib/portalApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import {
    MOCK_CAMPAIGNS, MOCK_CLIPPER, MOCK_PAYOUTS, MOCK_SUBMISSIONS,
} from "@/modules/app-portal/mockData";
import { resolvePortalRole, ROLE_PERMISSIONS } from "@/modules/app-portal/roleConfig";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return fmt(n);
};

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);
const isToday = (iso: string) => dayKey(iso) === dayKey(new Date().toISOString());
const isThisWeek = (iso: string) => {
    const now = Date.now();
    const t = new Date(iso).getTime();
    return now - t <= 7 * 86400000;
};

export function DashboardPage() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const a = t.app;
    const d = a.dashboard;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: me, loading: meLoading, error: meError } = useMe();
    const { data: campaigns, loading: campaignsLoading, error: campaignsError } = useCampaigns();
    const { data: submissions, loading: subsLoading, error: subsError } = useSubmissions();
    const { data: payouts, loading: payoutsLoading, error: payoutsError } = usePayouts();

    const shouldMockMe = shouldUsePortalMockData(Boolean(meError) && !meLoading);
    const shouldMockCampaigns = shouldUsePortalMockData(Boolean(campaignsError) && !campaignsLoading);
    const shouldMockSubs = shouldUsePortalMockData(Boolean(subsError) && !subsLoading);
    const shouldMockPayouts = shouldUsePortalMockData(Boolean(payoutsError) && !payoutsLoading);
    const isMock = shouldMockMe || shouldMockCampaigns || shouldMockSubs || shouldMockPayouts;

    const clipper = shouldMockMe ? MOCK_CLIPPER : (me ?? null);
    const campaignsData = shouldMockCampaigns ? MOCK_CAMPAIGNS : (campaigns ?? []);
    const submissionsData = shouldMockSubs ? MOCK_SUBMISSIONS : (submissions ?? []);
    const payoutsData = shouldMockPayouts ? MOCK_PAYOUTS : (payouts ?? []);

    const role = resolvePortalRole(clipper);
    const rolePerms = ROLE_PERMISSIONS[role];

    const earningsToday = submissionsData.filter((s) => isToday(s.created_at)).reduce((sum, s) => sum + s.calculated_payout, 0);
    const earningsWeek = submissionsData.filter((s) => isThisWeek(s.created_at)).reduce((sum, s) => sum + s.calculated_payout, 0);
    const viewsWeek = submissionsData.filter((s) => isThisWeek(s.created_at)).reduce((sum, s) => sum + s.play_count, 0);

    const activeCampaigns = campaignsData.filter((c) => c.status.includes("🟢"));
    const matchCampaign = (c: { campaign_name: string; client_name: string }) =>
        !searchQuery || [c.campaign_name, c.client_name].some((v) => v.toLowerCase().includes(searchQuery));
    const matchSub = (s: { campaign_name: string; video_url: string; status: string }) =>
        !searchQuery || [s.campaign_name, s.video_url, s.status].some((v) => v.toLowerCase().includes(searchQuery));
    const visibleCampaigns = activeCampaigns.filter(matchCampaign).slice(0, 4);
    const recentSubs = [...submissionsData]
        .filter(matchSub)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const username = clipper?.username ?? "—";
    const pending = clipper?.pending_balance ?? 0;
    const totalEarned = clipper?.total_earnings ?? 0;
    const paidOut = clipper?.paid_amount ?? 0;
    const totalViews = clipper?.total_views ?? 0;

    const minWithdraw = rolePerms.minWithdrawAmount;
    const canWithdraw = pending >= minWithdraw;
    const progressToMin = Math.min(100, (pending / minWithdraw) * 100);

    return (
        <div className="space-y-6 sm:space-y-7 pb-8 w-full">
            {/* Greeting */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {language === "th" ? "สวัสดี" : "Hello"},
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                        {username} 👋
                    </h1>
                </div>
                {role === "vip" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-500/30">
                        <Sparkles size={12} /> VIP
                    </span>
                )}
            </div>

            {isMock && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                </div>
            )}

            {/* ⬛ Hero balance card (the star of the page) */}
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 text-white shadow-xl shadow-blue-500/20"
            >
                {/* decorative blur */}
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" aria-hidden />
                <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl" aria-hidden />

                <div className="relative p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-xs font-bold text-blue-200/90 uppercase tracking-[0.18em]">{d.pendingBalance}</p>
                            <p className="text-[11px] font-medium text-blue-200/80 mt-0.5">
                                {language === "th" ? `ขั้นต่ำ ฿${fmt(minWithdraw)} ต่อครั้ง` : `Minimum ฿${fmt(minWithdraw)} per request`}
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                            <Wallet size={22} />
                        </div>
                    </div>

                    <p className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-1">
                        ฿{meLoading && !shouldMockMe ? "—" : fmt(pending)}
                    </p>
                    <p className="text-blue-200 text-sm font-medium">
                        {canWithdraw
                            ? (language === "th" ? "พร้อมถอนได้แล้ว 🎉" : "Ready to withdraw 🎉")
                            : (language === "th" ? `อีก ฿${fmt(minWithdraw - pending)} ถึงจะถอนได้` : `฿${fmt(minWithdraw - pending)} more to unlock withdrawal`)}
                    </p>

                    {/* progress to min withdraw */}
                    {!canWithdraw && (
                        <div className="mt-4 h-1.5 rounded-full bg-white/15 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressToMin}%` }} transition={{ duration: 0.7, delay: 0.1 }}
                                className="h-full bg-gradient-to-r from-emerald-300 to-emerald-400 rounded-full" />
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-blue-200/80 uppercase tracking-wider mb-1">{d.totalEarned}</p>
                            <p className="text-lg sm:text-xl font-extrabold">฿{fmt(totalEarned)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-200/80 uppercase tracking-wider mb-1">{d.withdrawn}</p>
                            <p className="text-lg sm:text-xl font-extrabold">฿{fmt(paidOut)}</p>
                        </div>
                    </div>

                    <Link href="/app/withdraw"
                        className={`mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${canWithdraw
                            ? "bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10"
                            : "bg-white/15 text-white border border-white/20 hover:bg-white/20"}`}>
                        <ArrowDownToLine size={16} />
                        {language === "th" ? "ถอนเงิน" : "Withdraw"}
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </motion.div>

            {/* Quick stat row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <QuickStat
                    label={language === "th" ? "วันนี้" : "Today"}
                    value={`฿${fmt(earningsToday)}`}
                    accent="text-emerald-600 dark:text-emerald-400"
                    iconBg="bg-emerald-100 dark:bg-emerald-500/15"
                    icon={<TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />}
                />
                <QuickStat
                    label={language === "th" ? "7 วันนี้" : "Last 7d"}
                    value={`฿${fmt(earningsWeek)}`}
                    accent="text-blue-600 dark:text-blue-400"
                    iconBg="bg-blue-100 dark:bg-blue-500/15"
                    icon={<BadgeDollarSign size={16} className="text-blue-600 dark:text-blue-400" />}
                />
                <QuickStat
                    label={language === "th" ? "วิวสัปดาห์นี้" : "Views (7d)"}
                    value={fmtViews(viewsWeek)}
                    accent="text-violet-600 dark:text-violet-400"
                    iconBg="bg-violet-100 dark:bg-violet-500/15"
                    icon={<Eye size={16} className="text-violet-600 dark:text-violet-400" />}
                />
            </div>

            {/* Quick actions (mobile-only) */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
                <QuickAction href="/app/campaigns" icon={<Megaphone size={18} />} label={a.nav.campaigns}
                    subtitle={`${activeCampaigns.length} ${language === "th" ? "เปิดอยู่" : "active"}`}
                    color="from-blue-500 to-blue-600" />
                <QuickAction href="/app/earnings" icon={<BadgeDollarSign size={18} />} label={a.nav.earnings}
                    subtitle={`฿${fmt(totalEarned)}`} color="from-emerald-500 to-emerald-600" />
            </div>

            {/* Two-column body */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Active campaigns */}
                <section className="lg:col-span-3 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {a.campaigns.activeCampaigns}
                            </h2>
                            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                                {activeCampaigns.length}
                            </span>
                        </div>
                        <Link href="/app/campaigns" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                            {language === "th" ? "ดูทั้งหมด" : "View all"} <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/8">
                        {campaignsLoading && !shouldMockCampaigns ? (
                            Array.from({ length: 3 }).map((_, i) => <CampaignRowSkeleton key={i} />)
                        ) : visibleCampaigns.length === 0 ? (
                            <EmptyState icon={<Megaphone size={28} />}
                                text={searchQuery ? `No campaigns match "${searchQuery}"` : (language === "th" ? "ยังไม่มีแคมเปญที่เปิดรับ" : "No active campaigns yet")} />
                        ) : (
                            visibleCampaigns.map((c) => {
                                const budgetTotal = c.total_budget * (1 - (c.platform_fee_rate ?? 0.3));
                                const budgetRemaining = budgetTotal - c.budget_spent;
                                const progress = Math.min(100, Math.round((c.budget_spent / budgetTotal) * 100));
                                return (
                                    <Link key={c.id} href="/app/campaigns" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors group">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-500/20 dark:to-violet-500/20 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center shrink-0">
                                            <Megaphone size={18} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{c.campaign_name}</p>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mb-1.5">{c.client_name}</p>
                                            <div className="h-1 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">฿{c.cost_per_thousand_views}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">/ 1K views</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{language === "th" ? "เหลือ" : "Left"} ฿{fmt(Math.max(0, budgetRemaining))}</p>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Recent submissions */}
                <section className="lg:col-span-2 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
                        <div className="flex items-center gap-2">
                            <Video size={15} className="text-slate-400 dark:text-slate-500" />
                            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {d.recentSubmissions}
                            </h2>
                        </div>
                        <Link href="/app/submissions" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                            {language === "th" ? "ทั้งหมด" : "All"} <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/8">
                        {subsLoading && !shouldMockSubs ? (
                            Array.from({ length: 3 }).map((_, i) => <SubRowSkeleton key={i} />)
                        ) : recentSubs.length === 0 ? (
                            <EmptyState icon={<Video size={28} />}
                                text={searchQuery ? `No submissions match "${searchQuery}"` : (language === "th" ? "ยังไม่มีวิดีโอที่ส่ง" : "No submissions yet")} />
                        ) : (
                            recentSubs.map((s) => {
                                const isActive = s.status.includes("🟢");
                                const isPending = s.status.includes("⏳");
                                const isRejected = s.status.includes("🔴") || s.status.includes("❌");
                                const dot = isActive ? "bg-emerald-400" : isRejected ? "bg-rose-400" : "bg-amber-400";
                                return (
                                    <Link key={s.id} href="/app/submissions" className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                                        <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{s.campaign_name}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{fmtViews(s.play_count)} {language === "th" ? "วิว" : "views"} · {new Date(s.created_at).toLocaleDateString(language === "th" ? "th-TH" : "en-US", { day: "2-digit", month: "short" })}</p>
                                        </div>
                                        {s.calculated_payout > 0 ? (
                                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">฿{fmt(s.calculated_payout)}</span>
                                        ) : isPending ? (
                                            <Clock size={14} className="text-amber-500 shrink-0" />
                                        ) : isRejected ? (
                                            <span className="text-[10px] font-bold text-rose-500 shrink-0">REJ</span>
                                        ) : (
                                            <CheckCircle2 size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>

            {/* Total views card */}
            <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Eye size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{language === "th" ? "วิวสะสมทั้งหมด" : "Lifetime views"}</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{fmtViews(totalViews)}</p>
                </div>
                <Link href="/app/earnings" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 shrink-0">
                    {language === "th" ? "ดูสถิติ" : "Stats"} <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
}

function QuickStat({ label, value, accent, iconBg, icon }: { label: string; value: string; accent: string; iconBg: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>{icon}</div>
            <p className={`text-base sm:text-lg font-extrabold leading-tight ${accent}`}>{value}</p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
    );
}

function QuickAction({ href, icon, label, subtitle, color }: { href: string; icon: React.ReactNode; label: string; subtitle: string; color: string }) {
    return (
        <Link href={href} className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-500/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shrink-0 shadow-sm`}>{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
        </Link>
    );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="px-5 py-12 text-center">
            <div className="text-slate-300 dark:text-slate-600 inline-flex">{icon}</div>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-2">{text}</p>
        </div>
    );
}

function CampaignRowSkeleton() {
    return (
        <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 dark:bg-white/8 rounded w-1/3" />
            </div>
            <div className="space-y-1.5">
                <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-2.5 w-10 bg-slate-100 dark:bg-white/8 rounded" />
            </div>
        </div>
    );
}

function SubRowSkeleton() {
    return (
        <div className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 dark:bg-white/8 rounded w-1/2" />
            </div>
            <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded" />
        </div>
    );
}
