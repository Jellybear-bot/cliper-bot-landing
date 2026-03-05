"use client";

import Link from "next/link";
import { Wallet, Eye, TrendingUp, BadgeDollarSign, ChevronRight, Video, Megaphone, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMe, useSubmissions } from "@/lib/portalApi";
import type { SubmissionResponse } from "@/lib/portalApi";
import { FORCE_PORTAL_MOCK_MODE, MOCK_CLIPPER, MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtCurrency = (n: number) => `฿${fmt(n)}`;
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return fmt(n);
};

function getStatusStyle(status: string) {
    if (status.includes("🟢")) return "bg-emerald-100 text-emerald-700";
    if (status.includes("⏳")) return "bg-amber-100 text-amber-700";
    if (status.includes("🔴") || status.includes("❌")) return "bg-rose-100 text-rose-700";
    if (status.includes("📉")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-600";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-20" />
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="h-5 bg-slate-100 rounded w-16 shrink-0" />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
    const { t } = useLanguage();
    const a = t.app;
    const d = a.dashboard;

    const { data: clipper, loading: meLoading, error: meError } = useMe();
    const { data: submissions, loading: subLoading, error: subError } = useSubmissions();

    const isMockMode = FORCE_PORTAL_MOCK_MODE || (Boolean(meError || subError) && !meLoading && !subLoading);
    const clipperData = isMockMode ? MOCK_CLIPPER : (clipper ?? null);
    const submissionData = isMockMode ? MOCK_SUBMISSIONS : (submissions ?? []);

    function getStatusLabel(status: string) {
        if (status.includes("🟢 Active")) return a.status.activeEarning;
        if (status.includes("⏳ Pending")) return a.status.pendingReview;
        if (status.includes("📉")) return a.status.gainingViews;
        if (status.includes("🔴")) return a.status.rejected;
        return status;
    }

    const recentSubs = submissionData.slice(0, 3);

    return (
        <div className="space-y-8 pb-12 w-full">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 font-medium text-xs mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {d.welcomeBack} {clipperData?.username ?? "..."}!
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{d.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{d.subtitle}</p>
            </div>

            {/* Mockup Banner */}
            {isMockMode && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราว"}
                    {meError && <span className="block text-xs mt-1">me: {meError}</span>}
                    {subError && <span className="block text-xs">submissions: {subError}</span>}
                </div>
            )}

            {/* Stat Cards */}
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Submissions */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Video size={18} className="text-slate-400" />
                            <h2 className="font-bold text-slate-800">{d.recentSubmissions}</h2>
                        </div>
                        <Link href="/app/submissions" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            {a.common.viewAll} <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {subLoading && !isMockMode ? (
                            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : recentSubs.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 text-sm">ยังไม่มีวิดีโอที่ส่ง</div>
                        ) : (
                            recentSubs.map((s: SubmissionResponse) => (
                                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                        <Video size={18} className="text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 truncate">
                                            {s.video_url.replace("https://", "")}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                                            {s.campaign_name} · {fmtViews(s.play_count)} {a.submissions.views}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusStyle(s.status)}`}>
                                            {getStatusLabel(s.status)}
                                        </span>
                                        {s.calculated_payout > 0 && (
                                            <span className="text-xs font-bold text-emerald-600">{fmtCurrency(s.calculated_payout)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                    {/* Withdraw CTA */}
                    {!meLoading && (clipperData?.pending_balance ?? 0) >= 100 && (
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                            <p className="text-sm font-semibold text-blue-200 mb-1">{d.readyToWithdraw}</p>
                            <p className="text-3xl font-extrabold mb-4">{fmtCurrency(clipperData!.pending_balance)}</p>
                            <Link href="/app/withdraw" className="flex items-center justify-center gap-2 w-full bg-white text-blue-700 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                                <Wallet size={16} /> {d.requestWithdrawal}
                            </Link>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-sm">{d.quickActions}</h3>
                        </div>
                        <div className="p-3 space-y-1">
                            <QuickAction href="/app/campaigns" icon={<Megaphone size={18} />} label={d.browseCampaigns} sub={d.browseCampaignsSub} color="text-blue-600 bg-blue-50" />
                            <QuickAction href="/app/submissions" icon={<Video size={18} />} label={d.mySubmissions} sub={d.mySubmissionsSub} color="text-violet-600 bg-violet-50" />
                            <QuickAction href="/app/withdraw" icon={<Wallet size={18} />} label={d.withdrawEarnings} sub={d.withdrawEarningsSub} color="text-emerald-600 bg-emerald-50" />
                        </div>
                    </div>

                    {/* Earnings Summary */}
                    {meLoading && !isMockMode ? (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 animate-pulse space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-slate-200 rounded w-24" />
                                    <div className="h-4 bg-slate-200 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <h3 className="font-bold text-slate-800 text-sm mb-4">{d.earningsBreakdown}</h3>
                            <div className="space-y-3">
                                <EarningsRow label={d.totalEarned} value={fmtCurrency(clipperData?.total_earnings ?? 0)} color="text-slate-700" />
                                <EarningsRow label={d.withdrawn} value={fmtCurrency(clipperData?.paid_amount ?? 0)} color="text-slate-500" />
                                <div className="border-t border-slate-100 pt-3">
                                    <EarningsRow label={d.pendingBalance} value={fmtCurrency(clipperData?.pending_balance ?? 0)} color="text-blue-600 font-bold" />
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
    label: string; value: string; sub: string; icon: React.ReactNode; iconBg: string; highlight?: boolean;
}) {
    return (
        <div className={`relative rounded-2xl p-6 border shadow-sm overflow-hidden ${highlight ? "bg-gradient-to-br from-blue-600 to-violet-600 border-transparent" : "bg-white border-slate-200"}`}>
            <div className="flex items-start justify-between mb-4">
                <p className={`text-sm font-semibold ${highlight ? "text-blue-200" : "text-slate-500"}`}>{label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? "bg-white/20" : iconBg} text-white`}>{icon}</div>
            </div>
            <p className={`text-3xl font-extrabold tracking-tight ${highlight ? "text-white" : "text-slate-900"}`}>{value}</p>
            <p className={`text-xs font-medium mt-1.5 ${highlight ? "text-blue-200" : "text-slate-400"}`}>{sub}</p>
        </div>
    );
}

function QuickAction({ href, icon, label, sub, color }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
        </Link>
    );
}

function EarningsRow({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">{label}</span>
            <span className={`text-sm ${color}`}>{value}</span>
        </div>
    );
}
