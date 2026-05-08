"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Wallet, Eye, TrendingUp, BadgeDollarSign, ChevronRight, Video, Megaphone, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useMe, useSubmissions } from "@/lib/portalApi";
import type { SubmissionResponse } from "@/lib/portalApi";
import { MOCK_CLIPPER, MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtCurrency = (n: number) => `฿${fmt(n)}`;
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return fmt(n);
};

function getStatusStyle(status: string) {
    if (status.includes("🟢")) return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
    if (status.includes("⏳")) return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400";
    if (status.includes("🔴") || status.includes("❌")) return "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400";
    if (status.includes("📉")) return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400";
    return "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400";
}

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-20" />
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/8 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-1/2" />
            </div>
            <div className="h-5 bg-slate-100 dark:bg-white/8 rounded w-16 shrink-0" />
        </div>
    );
}

export function DashboardPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const a = t.app;
    const d = a.dashboard;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: clipper, loading: meLoading, error: meError } = useMe();
    const { data: submissions, loading: subLoading, error: subError } = useSubmissions();

    const isMockMode = shouldUsePortalMockData(Boolean(meError || subError) && !meLoading && !subLoading);
    const clipperData = isMockMode ? MOCK_CLIPPER : (clipper ?? null);
    const submissionData = isMockMode ? MOCK_SUBMISSIONS : (submissions ?? []);

    function getStatusLabel(status: string) {
        if (status.includes("🟢 Active")) return a.status.activeEarning;
        if (status.includes("⏳ Pending")) return a.status.pendingReview;
        if (status.includes("📉")) return a.status.gainingViews;
        if (status.includes("🔴")) return a.status.rejected;
        return status;
    }

    const filteredSubmissions = searchQuery
        ? submissionData.filter((submission) => [submission.video_url, submission.campaign_name, submission.status].join(" ").toLowerCase().includes(searchQuery))
        : submissionData;
    const recentSubs = filteredSubmissions.slice(0, 3);

    return (
        <div className="space-y-8 pb-12 w-full">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-xs mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {d.welcomeBack} {clipperData?.username ?? "..."}!
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{d.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{d.subtitle}</p>
            </div>

            {isMockMode && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {meError && <span className="block text-xs mt-1">me: {meError}</span>}
                    {subError && <span className="block text-xs">submissions: {subError}</span>}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {meLoading && !isMockMode ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        <StatCard label={d.stats.pendingBalance} value={fmtCurrency(clipperData?.pending_balance ?? 0)} sub={d.stats.pendingBalanceSub} icon={<Wallet size={22} />} iconBg="bg-blue-600" highlight />
                        <StatCard label={d.stats.totalEarnings} value={fmtCurrency(clipperData?.total_earnings ?? 0)} sub={d.stats.totalEarningsSub} icon={<BadgeDollarSign size={22} />} iconBg="bg-violet-500" />
                        <StatCard label={d.stats.totalViews} value={fmtViews(clipperData?.total_views ?? 0)} sub={d.stats.totalViewsSub} icon={<Eye size={22} />} iconBg="bg-emerald-500" />
                        <StatCard label={d.stats.paidOut} value={fmtCurrency(clipperData?.paid_amount ?? 0)} sub={d.stats.paidOutSub} icon={<TrendingUp size={22} />} iconBg="bg-amber-500" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/8">
                        <div className="flex items-center gap-2">
                            <Video size={18} className="text-slate-400 dark:text-slate-500" />
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">{d.recentSubmissions}</h2>
                        </div>
                        <Link href="/app/submissions" className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            {a.common.viewAll} <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/8">
                        {subLoading && !isMockMode ? (
                            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : recentSubs.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                                {searchQuery ? `No submissions match "${searchQuery}"` : "ยังไม่มีวิดีโอที่ส่ง"}
                            </div>
                        ) : (
                            recentSubs.map((submission: SubmissionResponse) => (
                                <div key={submission.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                        <Video size={18} className="text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                            {submission.video_url.replace("https://", "")}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                            {submission.campaign_name} · {fmtViews(submission.play_count)} {a.submissions.views}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusStyle(submission.status)}`}>
                                            {getStatusLabel(submission.status)}
                                        </span>
                                        {submission.calculated_payout > 0 && (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{fmtCurrency(submission.calculated_payout)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {!meLoading && (clipperData?.pending_balance ?? 0) >= 100 && (
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-sm font-semibold text-blue-200 mb-1">{d.readyToWithdraw}</p>
                            <p className="text-3xl font-extrabold mb-4">{fmtCurrency(clipperData!.pending_balance)}</p>
                            <Link href="/app/withdraw" className="flex items-center justify-center gap-2 w-full bg-white text-blue-700 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                                <Wallet size={16} /> {d.requestWithdrawal}
                            </Link>
                        </div>
                    )}

                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{d.quickActions}</h3>
                        </div>
                        <div className="p-3 space-y-1">
                            <QuickAction href="/app/campaigns" icon={<Megaphone size={18} />} label={d.browseCampaigns} sub={d.browseCampaignsSub} color="text-blue-600 bg-blue-50 dark:bg-blue-500/15" />
                            <QuickAction href="/app/submissions" icon={<Video size={18} />} label={d.mySubmissions} sub={d.mySubmissionsSub} color="text-violet-600 bg-violet-50 dark:bg-violet-500/15" />
                            <QuickAction href="/app/withdraw" icon={<Wallet size={18} />} label={d.withdrawEarnings} sub={d.withdrawEarningsSub} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15" />
                        </div>
                    </div>

                    {meLoading && !isMockMode ? (
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-5 animate-pulse space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
                                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-4">{d.earningsBreakdown}</h3>
                            <div className="space-y-3">
                                <EarningsRow label={d.totalEarned} value={fmtCurrency(clipperData?.total_earnings ?? 0)} color="text-slate-700 dark:text-slate-200" />
                                <EarningsRow label={d.withdrawn} value={fmtCurrency(clipperData?.paid_amount ?? 0)} color="text-slate-500 dark:text-slate-400" />
                                <div className="border-t border-slate-100 dark:border-white/8 pt-3">
                                    <EarningsRow label={d.pendingBalance} value={fmtCurrency(clipperData?.pending_balance ?? 0)} color="text-blue-600 dark:text-blue-400 font-bold" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, icon, iconBg, highlight }: {
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    iconBg: string;
    highlight?: boolean;
}) {
    return (
        <div className={`relative rounded-2xl p-6 border shadow-sm overflow-hidden ${highlight ? "bg-gradient-to-br from-blue-600 to-violet-600 border-transparent" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"}`}>
            <div className="flex items-start justify-between mb-4">
                <p className={`text-sm font-semibold ${highlight ? "text-blue-200" : "text-slate-500 dark:text-slate-400"}`}>{label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? "bg-white/20" : iconBg} text-white`}>{icon}</div>
            </div>
            <p className={`text-3xl font-extrabold tracking-tight ${highlight ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>{value}</p>
            <p className={`text-xs font-medium mt-1.5 ${highlight ? "text-blue-200" : "text-slate-400 dark:text-slate-500"}`}>{sub}</p>
        </div>
    );
}

function QuickAction({ href, icon, label, sub, color }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>
            </div>
            <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
        </Link>
    );
}

function EarningsRow({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className={`text-sm ${color}`}>{value}</span>
        </div>
    );
}
