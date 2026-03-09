"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Video, Eye, DollarSign, ThumbsUp, MessageCircle, Share2, ExternalLink } from "lucide-react";
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
    if (status.includes("🟢")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status.includes("⏳")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (status.includes("🔴") || status.includes("❌")) return "bg-rose-100 text-rose-700 border-rose-200";
    if (status.includes("📉")) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 p-5 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="h-5 bg-slate-200 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-12" />
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
        if (status.includes("🟢 Active")) return a.status.activeEarning;
        if (status.includes("⏳")) return a.status.pendingReview;
        if (status.includes("📉")) return a.status.gainingViews;
        if (status.includes("🔴")) return a.status.rejected;
        return status;
    }

    function getStatusDesc(status: string) {
        if (status.includes("🟢")) return s.statusDesc.active;
        if (status.includes("⏳")) return s.statusDesc.pending;
        if (status.includes("📉")) return s.statusDesc.waiting;
        if (status.includes("🔴")) return s.statusDesc.rejected;
        return "";
    }

    const FILTERS: { key: FilterKey; label: string; match: (sub: SubmissionResponse) => boolean }[] = [
        { key: "all", label: s.filterAll, match: () => true },
        { key: "active", label: s.filterActive, match: (sub) => sub.status.includes("🟢") },
        { key: "pending", label: s.filterPending, match: (sub) => sub.status.includes("⏳") },
        { key: "waiting", label: s.filterWaiting, match: (sub) => sub.status.includes("📉") },
        { key: "rejected", label: s.filterRejected, match: (sub) => sub.status.includes("🔴") || sub.status.includes("❌") },
    ];

    const searched = searchQuery
        ? list.filter((submission) => [submission.video_url, submission.campaign_name, submission.status].join(" ").toLowerCase().includes(searchQuery))
        : list;
    const filtered = searched.filter(FILTERS.find((filter) => filter.key === activeFilter)!.match);
    const totalEarnings = searched.reduce((sum, sub) => sum + sub.calculated_payout, 0);
    const totalViews = searched.reduce((sum, sub) => sum + sub.play_count, 0);
    const activeCount = searched.filter((sub) => sub.status.includes("🟢")).length;

    return (
        <div className="space-y-7 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{s.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{s.subtitle}</p>
            </div>

            {shouldMockSubmissions && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {error && <span className="block text-xs mt-1">submissions: {error}</span>}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryCard label={s.totalSubmitted} value={loading && !shouldMockSubmissions ? "..." : String(searched.length)} icon={<Video size={18} />} iconBg="bg-slate-100" iconColor="text-slate-600" />
                <SummaryCard label={s.activeEarning} value={loading && !shouldMockSubmissions ? "..." : String(activeCount)} icon={<Eye size={18} />} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                <SummaryCard label={s.totalViews} value={loading && !shouldMockSubmissions ? "..." : fmtViews(totalViews)} icon={<Eye size={18} />} iconBg="bg-blue-100" iconColor="text-blue-600" />
                <SummaryCard label={s.totalEarnings} value={loading && !shouldMockSubmissions ? "..." : `฿${fmt(totalEarnings)}`} icon={<DollarSign size={18} />} iconBg="bg-violet-100" iconColor="text-violet-600" />
            </div>

            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((filter) => {
                    const count = searched.filter(filter.match).length;
                    return (
                        <button key={filter.key} onClick={() => setActiveFilter(filter.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeFilter === filter.key
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                            {filter.label}
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeFilter === filter.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                                {loading ? "-" : count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-3">
                {loading && !shouldMockSubmissions ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <SkeletonRow />
                        </div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                        <Video size={40} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-semibold">{searchQuery ? `No submissions match "${searchQuery}"` : s.noSubmissions}</p>
                        {!searchQuery && <p className="text-slate-400 text-sm mt-1">{s.noSubmissionsSub}</p>}
                    </div>
                ) : (
                    filtered.map((submission) => (
                        <SubmissionCard key={submission.id} submission={submission}
                            getStatusLabel={getStatusLabel} getStatusDesc={getStatusDesc} />
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50/60 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Video size={20} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-700 truncate">{sub.video_url.replace("https://", "")}</p>
                        <a href={sub.video_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-blue-500 transition-colors shrink-0">
                            <ExternalLink size={13} />
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                        <span className="font-semibold text-slate-500">{sub.campaign_name}</span>
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
                        <span className="text-sm font-extrabold text-emerald-600">฿{fmt(sub.calculated_payout)}</span>
                    ) : (
                        <span className="text-xs text-slate-300 font-medium">฿0</span>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                    <p className="text-xs text-slate-500 font-medium mb-4 bg-white border border-slate-200 rounded-lg px-3 py-2">
                        {getStatusDesc(sub.status)}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatMini icon={<Eye size={14} />} label={s.views} value={fmtViews(sub.play_count)} />
                        <StatMini icon={<ThumbsUp size={14} />} label={s.likes} value={fmtViews(sub.like_count)} />
                        <StatMini icon={<MessageCircle size={14} />} label={s.comments} value={fmtViews(sub.comments_count)} />
                        <StatMini icon={<Share2 size={14} />} label={s.shares} value={fmtViews(sub.share_count)} />
                    </div>
                    {sub.calculated_payout > 0 && (
                        <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                            <span className="text-sm font-semibold text-emerald-700">{s.totalEarningsFromVideo}</span>
                            <span className="text-base font-extrabold text-emerald-700">฿{fmt(sub.calculated_payout)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, icon, iconBg, iconColor }: { label: string; value: string; icon: React.ReactNode; iconBg: string; iconColor: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>{icon}</div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}

function StatMini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-base font-bold text-slate-800">{value}</p>
        </div>
    );
}
