"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Video, Eye, DollarSign, ThumbsUp, MessageCircle, Share2, ExternalLink, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useSubmissions } from "@/lib/portalApi";
import type { SubmissionResponse } from "@/lib/portalApi";
import { MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return fmt(n);
};

function getStatusStyle(status: string) {
    const normalized = status.toLowerCase();
    if (status.includes("🔴") || status.includes("❌") || normalized.includes("reject") || normalized.includes("declin") || normalized.includes("denied")) return "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
    if (status.includes("🟢") || normalized.includes("active") || normalized.includes("approved") || normalized.includes("complete") || normalized.includes("done")) return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    if (status.includes("⏳") || normalized.includes("pending") || normalized.includes("review")) return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
    if (status.includes("📉") || normalized.includes("growing") || normalized.includes("waiting") || normalized.includes("gaining")) return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
    return "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10";
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 p-5 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-1/2" />
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-20" />
                <div className="h-4 bg-slate-100 dark:bg-white/8 rounded w-12" />
            </div>
        </div>
    );
}

type FilterKey = "all" | "active" | "pending" | "waiting" | "rejected";

export function SubmissionsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const a = t.app;
    const s = a.submissions;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: submissions, loading, error } = useSubmissions();
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

    const shouldMockSubmissions = shouldUsePortalMockData(Boolean(error) && !loading);
    const list = shouldMockSubmissions ? MOCK_SUBMISSIONS : (submissions ?? []);

    function getStatusLabel(status: string) {
        const normalized = status.toLowerCase();
        if (status.includes("🔴") || status.includes("❌") || normalized.includes("reject") || normalized.includes("declin") || normalized.includes("denied")) return a.status.rejected;
        if (normalized.includes("complete") || normalized.includes("done") || normalized.includes("finished")) return a.common.completed;
        if (status.includes("🟢") || normalized.includes("active") || normalized.includes("approved")) return a.status.activeEarning;
        if (status.includes("⏳") || normalized.includes("pending") || normalized.includes("review")) return a.status.pendingReview;
        if (status.includes("📉") || normalized.includes("growing") || normalized.includes("waiting") || normalized.includes("gaining")) return a.status.gainingViews;
        return status;
    }

    function getStatusDesc(status: string) {
        const normalized = status.toLowerCase();
        if (status.includes("🔴") || status.includes("❌") || normalized.includes("reject") || normalized.includes("declin") || normalized.includes("denied")) return s.statusDesc.rejected;
        if (status.includes("🟢") || normalized.includes("active") || normalized.includes("approved") || normalized.includes("complete") || normalized.includes("done")) return s.statusDesc.active;
        if (status.includes("⏳") || normalized.includes("pending") || normalized.includes("review")) return s.statusDesc.pending;
        if (status.includes("📉") || normalized.includes("growing") || normalized.includes("waiting") || normalized.includes("gaining")) return s.statusDesc.waiting;
        return "";
    }

    const FILTERS: { key: FilterKey; label: string; match: (sub: SubmissionResponse) => boolean }[] = [
        { key: "all", label: s.filterAll, match: () => true },
        { key: "active", label: s.filterActive, match: (sub) => sub.status.includes("🟢") || /active|approved|complete|done/i.test(sub.status) },
        { key: "pending", label: s.filterPending, match: (sub) => sub.status.includes("⏳") || /pending|review/i.test(sub.status) },
        { key: "waiting", label: s.filterWaiting, match: (sub) => sub.status.includes("📉") || /growing|waiting|gaining/i.test(sub.status) },
        { key: "rejected", label: s.filterRejected, match: (sub) => sub.status.includes("🔴") || sub.status.includes("❌") || /reject|declin|denied/i.test(sub.status) },
    ];

    const searched = searchQuery
        ? list.filter((submission) => [submission.video_url, submission.campaign_name, submission.status].join(" ").toLowerCase().includes(searchQuery))
        : list;
    const filtered = searched.filter(FILTERS.find((filter) => filter.key === activeFilter)!.match);
    const totalEarnings = searched.reduce((sum, sub) => sum + sub.calculated_payout, 0);
    const totalViews = searched.reduce((sum, sub) => sum + sub.play_count, 0);
    const activeCount = searched.filter((sub) => sub.status.includes("🟢") || /active|approved|complete|done/i.test(sub.status)).length;

    return (
        <div className="space-y-7 pb-12 w-full">
            {/* Page header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{s.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{s.subtitle}</p>
            </div>

            {shouldMockSubmissions && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {error && <span className="block text-xs mt-1">submissions: {error}</span>}
                </div>
            )}

            {/* Summary cards — Var A style */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryCard
                    label={s.totalSubmitted}
                    value={loading && !shouldMockSubmissions ? "..." : String(searched.length)}
                    icon={<Video size={18} />}
                    iconBg="bg-slate-100 dark:bg-white/10"
                    iconColor="text-slate-600 dark:text-slate-300"
                />
                <SummaryCard
                    label={s.activeEarning}
                    value={loading && !shouldMockSubmissions ? "..." : String(activeCount)}
                    icon={<Eye size={18} />}
                    iconBg="bg-emerald-100 dark:bg-emerald-500/20"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                />
                <SummaryCard
                    label={s.totalViews}
                    value={loading && !shouldMockSubmissions ? "..." : fmtViews(totalViews)}
                    icon={<Eye size={18} />}
                    iconBg="bg-blue-100 dark:bg-blue-500/20"
                    iconColor="text-blue-600 dark:text-blue-400"
                />
                <SummaryCard
                    label={s.totalEarnings}
                    value={loading && !shouldMockSubmissions ? "..." : `฿${fmt(totalEarnings)}`}
                    icon={<DollarSign size={18} />}
                    iconBg="bg-violet-100 dark:bg-violet-500/20"
                    iconColor="text-violet-600 dark:text-violet-400"
                    valueClass="text-emerald-600 dark:text-emerald-400 font-mono"
                />
            </div>

            {/* Segmented filter bar */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((filter) => {
                    const count = searched.filter(filter.match).length;
                    const isActive = activeFilter === filter.key;
                    return (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm shadow-blue-500/20"
                                : "bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"}`}
                        >
                            {filter.label}
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"}`}>
                                {loading ? "-" : count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Submissions list */}
            <div className="space-y-3">
                {loading && !shouldMockSubmissions ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                            <SkeletonRow />
                        </div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
                        <Video size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">
                            {searchQuery ? `No submissions match "${searchQuery}"` : s.noSubmissions}
                        </p>
                        {!searchQuery && <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{s.noSubmissionsSub}</p>}
                    </div>
                ) : (
                    filtered.map((submission) => (
                        <SubmissionCard
                            key={submission.id}
                            submission={submission}
                            getStatusLabel={getStatusLabel}
                            getStatusDesc={getStatusDesc}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function SubmissionCard({ submission: sub, getStatusLabel, getStatusDesc }: {
    submission: SubmissionResponse;
    getStatusLabel: (s: string) => string;
    getStatusDesc: (s: string) => string;
}) {
    const { t } = useLanguage();
    const s = t.app.submissions;
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-500/20 dark:to-violet-500/20 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0">
                    <Video size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{sub.video_url.replace("https://", "")}</p>
                        <a
                            href={sub.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shrink-0"
                        >
                            <ExternalLink size={13} />
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-medium flex-wrap">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">{sub.campaign_name}</span>
                        <span>·</span>
                        <span>{fmtViews(sub.play_count)} {s.views}</span>
                        <span>·</span>
                        <span>{new Date(sub.created_at).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${getStatusStyle(sub.status)}`}>
                        {getStatusLabel(sub.status)}
                    </span>
                    {sub.calculated_payout > 0 ? (
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">฿{fmt(sub.calculated_payout)}</span>
                    ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600 font-medium">฿0</span>
                    )}
                </div>
                <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </div>

            {expanded && (
                <div className="border-t border-slate-100 dark:border-white/8 px-5 py-4 bg-slate-50/50 dark:bg-white/[0.02]">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2">
                        {getStatusDesc(sub.status)}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatMini icon={<Eye size={14} />} label={s.views} value={fmtViews(sub.play_count)} />
                        <StatMini icon={<ThumbsUp size={14} />} label={s.likes} value={fmtViews(sub.like_count)} />
                        <StatMini icon={<MessageCircle size={14} />} label={s.comments} value={fmtViews(sub.comments_count)} />
                        <StatMini icon={<Share2 size={14} />} label={s.shares} value={fmtViews(sub.share_count)} />
                    </div>
                    {sub.calculated_payout > 0 && (
                        <div className="mt-3 flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3">
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{s.totalEarningsFromVideo}</span>
                            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">฿{fmt(sub.calculated_payout)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, icon, iconBg, iconColor, valueClass }: {
    label: string;
    value: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    valueClass?: string;
}) {
    return (
        <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>{icon}</div>
            <p className={`text-2xl font-extrabold ${valueClass ?? "text-slate-900 dark:text-slate-100"}`}>{value}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
    );
}

function StatMini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    );
}
