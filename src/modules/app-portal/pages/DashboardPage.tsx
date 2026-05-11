"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCampaigns, useMe, usePayouts, useSubmissions } from "@/lib/portalApi";
import type { CampaignResponse, SubmissionResponse } from "@/lib/portalApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import {
    MOCK_CAMPAIGNS, MOCK_CLIPPER, MOCK_PAYOUTS, MOCK_SUBMISSIONS,
} from "@/modules/app-portal/mockData";
import { resolvePortalRole, ROLE_PERMISSIONS, isVipCampaign } from "@/modules/app-portal/roleConfig";

// ── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));
const fmtBaht = (n: number) => `฿${fmt(n)}`;
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return fmt(n);
};

// ── Sparkline (SVG polyline) ──────────────────────────────────────────────────
function Spark({ data, height = 36, width = 160 }: { data: number[]; height?: number; width?: number }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / span) * height;
        return `${x},${y}`;
    }).join(" ");
    const area = `0,${height} ${pts} ${width},${height}`;
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible w-full">
            <polygon points={area} fill="currentColor" opacity="0.15" />
            <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Bar chart (SVG rects) ─────────────────────────────────────────────────────
interface BarsDatum { e: number }
function Bars({ data, height = 64, width = 280 }: { data: BarsDatum[]; height?: number; width?: number }) {
    const max = Math.max(...data.map((d) => d.e));
    const bw = width / data.length - 2;
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            {data.map((d, i) => {
                const h = (d.e / max) * (height - 4);
                return (
                    <rect
                        key={i}
                        x={i * (width / data.length)}
                        y={height - h}
                        width={bw}
                        height={h}
                        rx="2"
                        fill="currentColor"
                        opacity={0.4 + (i / data.length) * 0.6}
                    />
                );
            })}
        </svg>
    );
}

// ── Static sparkline / bar data ───────────────────────────────────────────────
const SPARKLINE_DATA = [12, 18, 22, 28, 35, 31, 44, 52, 49, 61, 68, 74, 81, 92, 88, 104];
const DAILY_DATA: BarsDatum[] = [
    { e: 48 }, { e: 112 }, { e: 180 }, { e: 248 }, { e: 352 }, { e: 496 },
    { e: 640 }, { e: 840 }, { e: 960 }, { e: 1152 }, { e: 1280 }, { e: 1420 },
    { e: 1600 }, { e: 1928 },
];

// ── Thumb gradients ───────────────────────────────────────────────────────────
const THUMB_GRADIENTS = [
    "from-rose-500 to-orange-400",
    "from-violet-500 to-fuchsia-400",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-sky-500 to-blue-400",
];

// ── Status helpers ────────────────────────────────────────────────────────────
type StatusKey = "active" | "pending" | "waiting" | "rejected";

function getStatusKey(status: string): StatusKey {
    if (status.includes("🟢") || status.toLowerCase().includes("active")) return "active";
    if (status.includes("⏳") || status.toLowerCase().includes("pending")) return "pending";
    if (status.includes("📉") || status.toLowerCase().includes("growing") || status.toLowerCase().includes("waiting")) return "waiting";
    return "rejected";
}

const STATUS_COLORS: Record<StatusKey, string> = {
    active: "text-emerald-600",
    pending: "text-amber-600",
    waiting: "text-blue-500",
    rejected: "text-rose-500",
};

// ── Growth % per submission index (design-static) ─────────────────────────────
const GROWTH_PCT = [12.4, 8.1, 24.0, 3.0, -2.3];

// ── Main export ───────────────────────────────────────────────────────────────
export function DashboardPage() {
    const { language } = useLanguage();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const [filter, setFilter] = useState<StatusKey | "all">("all");

    const { data: me, loading: meLoading, error: meError } = useMe();
    const { data: campaigns, loading: _cl, error: campaignsError } = useCampaigns();
    const { data: submissions, loading: _sl, error: subsError } = useSubmissions();
    const { data: _payouts, loading: _pl, error: payoutsError } = usePayouts();

    const shouldMockMe = shouldUsePortalMockData(Boolean(meError) && !meLoading);
    const shouldMockCampaigns = shouldUsePortalMockData(Boolean(campaignsError));
    const shouldMockSubs = shouldUsePortalMockData(Boolean(subsError));
    const shouldMockPayouts = shouldUsePortalMockData(Boolean(payoutsError));
    const isMock = shouldMockMe || shouldMockCampaigns || shouldMockSubs || shouldMockPayouts;

    const clipper = shouldMockMe ? MOCK_CLIPPER : (me ?? null);
    const campaignsData: CampaignResponse[] = shouldMockCampaigns ? MOCK_CAMPAIGNS : (campaigns ?? []);
    const submissionsData: SubmissionResponse[] = shouldMockSubs ? MOCK_SUBMISSIONS : (submissions ?? []);

    const role = resolvePortalRole(clipper);
    const rolePerms = ROLE_PERMISSIONS[role];

    const pending = clipper?.pending_balance ?? 0;
    const totalEarned = clipper?.total_earnings ?? 0;
    const paidOut = clipper?.paid_amount ?? 0;
    const totalViews = clipper?.total_views ?? 0;
    const minWithdraw = rolePerms.minWithdrawAmount;
    const canWithdraw = pending >= minWithdraw;

    // Filter helpers
    const matchSub = (s: SubmissionResponse) =>
        !searchQuery || [s.campaign_name, s.video_url, s.status].some((v) => v.toLowerCase().includes(searchQuery));

    const filteredSubs = submissionsData
        .filter(matchSub)
        .filter((s) => filter === "all" || getStatusKey(s.status) === filter)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);

    const matchCampaign = (c: CampaignResponse) =>
        !searchQuery || [c.campaign_name, c.client_name].some((v) => v.toLowerCase().includes(searchQuery));

    const visibleCampaigns = campaignsData
        .filter((c) => c.status.includes("🟢"))
        .filter(matchCampaign)
        .slice(0, 3);

    // i18n helpers (inline since keys don't map 1:1 with shared.jsx labels)
    const label = {
        pending: language === "th" ? "พร้อมถอน" : "Ready to withdraw",
        pendingSub: language === "th" ? "ถอนเข้าธนาคารได้ทันที" : "Available for instant payout",
        withdrawNow: language === "th" ? "ถอนเงินเลย" : "Withdraw now",
        minWithdraw: language === "th"
            ? `ขั้นต่ำ ฿${fmt(minWithdraw)} · โอนภายใน 24 ชม.`
            : `Min ฿${fmt(minWithdraw)} · paid within 24h`,
        totalEarnings: language === "th" ? "รายได้รวม" : "Lifetime earnings",
        paidOut: language === "th" ? "ถอนแล้ว" : "Paid out",
        totalViews: language === "th" ? "ยอดวิวรวม" : "Total views",
        todayEarning: language === "th" ? "วันนี้ได้" : "Today",
        streak: language === "th" ? "ปั่นต่อเนื่อง" : "Streak",
        streakDays: language === "th" ? "วัน" : "days",
        earningsThisMonth: language === "th" ? "รายได้เดือนนี้" : "Earnings this month",
        recentVideos: language === "th" ? "วิดีโอล่าสุด" : "Recent videos",
        activeCampaigns: language === "th" ? "แคมเปญที่กำลังเปิด" : "Active campaigns",
        viewAll: language === "th" ? "ดูทั้งหมด" : "View all",
        daysLeft: language === "th" ? "เหลือ" : "left",
        noVideos: language === "th" ? "ไม่พบวิดีโอ" : "No videos found",
        noCampaigns: language === "th" ? "ยังไม่มีแคมเปญที่เปิดรับ" : "No active campaigns yet",
    };

    const filterLabels: Record<StatusKey | "all", string> = {
        all: language === "th" ? "ทั้งหมด" : "All",
        active: language === "th" ? "กำลังได้รายได้" : "Earning",
        pending: language === "th" ? "รอตรวจสอบ" : "Review",
        waiting: language === "th" ? "สะสมวิว" : "Building",
        rejected: language === "th" ? "ถูกปฏิเสธ" : "Rejected",
    };

    const statusLabels: Record<StatusKey, string> = {
        active: language === "th" ? "กำลังได้รายได้" : "Earning",
        pending: language === "th" ? "รอตรวจสอบ" : "Review",
        waiting: language === "th" ? "กำลังสะสมวิว" : "Building views",
        rejected: language === "th" ? "ถูกปฏิเสธ" : "Rejected",
    };

    return (
        <div className="space-y-5 pb-8 w-full">
            {/* Mock data warning */}
            {isMock && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                </div>
            )}

            {/* ── HERO ROW ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-12 gap-5">

                {/* Big withdraw hero — 7 cols */}
                <div
                    className="col-span-12 lg:col-span-7 relative overflow-hidden rounded-3xl p-7 text-white shadow-xl shadow-blue-900/20"
                    style={{ background: "linear-gradient(135deg, #1E40AF 0%, #4C1D95 60%, #6D28D9 100%)" }}
                >
                    <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute right-20 top-8 w-40 h-40 rounded-full bg-violet-400/30 blur-3xl pointer-events-none" />

                    <div className="relative">
                        {/* Ready label */}
                        <div className="flex items-center gap-2 text-blue-200 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-[0.18em]">{label.pending}</p>
                        </div>

                        {/* Balance */}
                        <p className="text-[68px] font-black tracking-tighter leading-none mt-2 font-mono" style={{ fontFeatureSettings: '"tnum"' }}>
                            ฿{meLoading && !shouldMockMe ? "—" : fmt(pending)}
                            <span className="text-3xl text-blue-200 font-bold">.00</span>
                        </p>
                        <p className="text-sm text-blue-100/80 font-medium mt-2">{label.pendingSub}</p>

                        {/* CTA */}
                        <div className="flex items-center gap-3 mt-7">
                            <Link
                                href="/app/withdraw"
                                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 ${
                                    canWithdraw ? "bg-white text-blue-700" : "bg-white/20 text-white border border-white/30"
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M12 5v14M5 12l7 7 7-7" />
                                </svg>
                                {label.withdrawNow}
                            </Link>
                            <div className="text-xs text-blue-100/80 font-semibold">{label.minWithdraw}</div>
                        </div>

                        {/* Mini stats */}
                        <div className="mt-7 pt-6 border-t border-white/10 grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">{label.totalEarnings}</p>
                                <p className="text-xl font-extrabold mt-1 font-mono">{fmtBaht(totalEarned)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">{label.paidOut}</p>
                                <p className="text-xl font-extrabold mt-1 font-mono">{fmtBaht(paidOut)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">{label.totalViews}</p>
                                <p className="text-xl font-extrabold mt-1 font-mono">{fmtViews(totalViews)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: today + streak + monthly — 5 cols */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-5">
                    {/* Today earnings */}
                    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label.todayEarning}</p>
                            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">+12.4%</span>
                        </div>
                        <p className="text-3xl font-black tracking-tight mt-2 font-mono">฿428</p>
                        <div className="mt-3 -mx-1 text-emerald-500">
                            <Spark data={SPARKLINE_DATA} height={32} width={160} />
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label.streak}</p>
                            <span className="text-xl">🔥</span>
                        </div>
                        <p className="text-3xl font-black tracking-tight mt-2 font-mono">
                            12<span className="text-base text-slate-400 font-bold ml-1">{label.streakDays}</span>
                        </p>
                        <div className="flex gap-1 mt-3">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className={`flex-1 h-2 rounded-full ${i < 5 ? "bg-amber-400" : "bg-slate-200 dark:bg-white/10"}`} />
                            ))}
                        </div>
                    </div>

                    {/* Monthly earnings — full width */}
                    <div className="col-span-2 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label.earningsThisMonth}</p>
                                <p className="text-2xl font-black tracking-tight mt-1 font-mono">฿{fmt(8920)}</p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                                ↗ +28%
                            </div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                            <Bars data={DAILY_DATA} height={64} width={280} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                            <span>14d ago</span>
                            <span>today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RECENT VIDEOS + ACTIVE CAMPAIGNS ─────────────────────── */}
            <div className="grid grid-cols-12 gap-5">

                {/* Recent videos — 7 cols */}
                <section className="col-span-12 lg:col-span-7 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <h2 className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{label.recentVideos}</h2>
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
                            {(["all", "active", "pending", "waiting"] as const).map((k) => (
                                <button
                                    key={k}
                                    onClick={() => setFilter(k)}
                                    className={`px-2.5 py-1 text-[11px] rounded-md font-bold transition ${
                                        filter === k
                                            ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {filterLabels[k]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/[0.08]">
                        {filteredSubs.length === 0 ? (
                            <div className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">{label.noVideos}</div>
                        ) : (
                            filteredSubs.map((s, idx) => {
                                const platform = s.video_url.toLowerCase().includes("youtube") ? "youtube" : "tiktok";
                                const thumb = THUMB_GRADIENTS[idx % THUMB_GRADIENTS.length];
                                const statusKey = getStatusKey(s.status);
                                const growthPct = GROWTH_PCT[idx] ?? 0;
                                return (
                                    <Link
                                        key={s.id}
                                        href="/app/submissions"
                                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] cursor-pointer"
                                    >
                                        {/* Thumbnail */}
                                        <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${thumb} flex items-center justify-center shrink-0 shadow-sm`}>
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                                {platform === "tiktok"
                                                    ? <span className="text-[9px] font-black text-slate-800 dark:text-slate-200">TT</span>
                                                    : <span className="text-[9px] font-black text-rose-500">YT</span>}
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">{s.campaign_name}</p>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                                <span className="font-mono truncate">{s.video_url.replace("https://", "")}</span>
                                            </div>
                                        </div>
                                        {/* Views */}
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-mono">{fmtViews(s.play_count)}</p>
                                            <p className={`text-[10px] font-bold ${growthPct >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                                {growthPct >= 0 ? "↗" : "↘"} {Math.abs(growthPct)}%
                                            </p>
                                        </div>
                                        {/* Payout + status */}
                                        <div className="text-right shrink-0 w-20">
                                            {s.calculated_payout > 0
                                                ? <p className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{fmtBaht(s.calculated_payout)}</p>
                                                : <p className="text-slate-300 dark:text-slate-600 font-bold text-xs">—</p>}
                                            <p className={`mt-0.5 text-[9px] font-bold uppercase tracking-wider ${STATUS_COLORS[statusKey]}`}>
                                                {statusLabels[statusKey]}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Active campaigns — 5 cols */}
                <section className="col-span-12 lg:col-span-5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <h2 className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{label.activeCampaigns}</h2>
                        <Link href="/app/campaigns" className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            {label.viewAll} →
                        </Link>
                    </div>
                    <div className="px-3 pb-3 space-y-2">
                        {visibleCampaigns.length === 0 ? (
                            <p className="px-3 py-8 text-center text-sm text-slate-400 dark:text-slate-500">{label.noCampaigns}</p>
                        ) : (
                            visibleCampaigns.map((c: CampaignResponse) => {
                                const vip = isVipCampaign(c);
                                const pct = Math.min(100, Math.round((c.total_views_generated / c.view_target) * 100));
                                const displayName = c.campaign_name.replace(/^\[VIP\]\s*/i, "");
                                return (
                                    <Link key={c.id} href="/app/campaigns" className="block p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors">
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white font-black text-sm shadow ${
                                                vip ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-blue-500 to-violet-600"
                                            }`}>
                                                {c.client_name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">{displayName}</p>
                                                    {vip && (
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded">VIP</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">฿{c.cost_per_thousand_views}/1K</span>
                                                    <span>·</span>
                                                    <span>9d {label.daysLeft}</span>
                                                </div>
                                                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                                                    <span>{fmtViews(c.total_views_generated)} / {fmtViews(c.view_target)}</span>
                                                    <span>{pct}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
