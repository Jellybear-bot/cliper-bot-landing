"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, ExternalLink, Send, CheckCircle2, AlertCircle, Link as LinkIcon, TrendingUp, Target, DollarSign, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCampaigns, useSubmissions } from "@/lib/portalApi";
import type { CampaignResponse, SubmissionResponse } from "@/lib/portalApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return fmt(n);
};

function getStatusStyle(status: string) {
    if (status.includes("🟢")) return "bg-emerald-100 text-emerald-700";
    if (status.includes("⏳")) return "bg-amber-100 text-amber-700";
    if (status.includes("🔴") || status.includes("❌")) return "bg-rose-100 text-rose-700";
    if (status.includes("📉")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-600";
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function CampaignSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-48" />
                    <div className="h-3 bg-slate-100 rounded w-32" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 h-20 border border-slate-100" />
                ))}
            </div>
            <div className="h-8 bg-slate-100 rounded-xl w-32" />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CampaignsPage() {
    const { t } = useLanguage();
    const a = t.app;
    const c = a.campaigns;

    const { data: campaigns, loading, error } = useCampaigns();
    const { data: mySubmissions } = useSubmissions();

    const activeCampaigns = campaigns?.filter((c) => c.status.includes("🟢")) ?? [];
    const completedCampaigns = campaigns?.filter((c) => c.status.includes("🔴")) ?? [];

    const joinedCampaignNames = new Set(mySubmissions?.map((s) => s.campaign_name) ?? []);

    return (
        <div className="space-y-8 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{c.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{c.subtitle}</p>
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-blue-800 mb-2">{c.howItWorks}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {[c.step1, c.step2, c.step3].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <p className="text-blue-700 font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl">
                    ⚠️ โหลดแคมเปญไม่ได้: {error}
                </div>
            )}

            {/* Active Campaigns */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {c.activeCampaigns} {!loading && `(${activeCampaigns.length})`}
                </h2>
                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => <CampaignSkeleton key={i} />)
                    ) : activeCampaigns.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
                            <Megaphone size={36} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-400 font-medium">ไม่มีแคมเปญที่เปิดรับในขณะนี้</p>
                        </div>
                    ) : (
                        activeCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                isJoined={joinedCampaignNames.has(campaign.campaign_name)}
                                mySubmissions={(mySubmissions ?? []).filter((s) => s.campaign_name === campaign.campaign_name)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Completed */}
            {completedCampaigns.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-500 mb-4">{c.completedCampaigns}</h2>
                    <div className="space-y-3">
                        {completedCampaigns.map((campaign) => (
                            <div key={campaign.id} className="bg-white border border-slate-200 rounded-2xl p-5 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-slate-600">{campaign.campaign_name}</p>
                                        <p className="text-xs text-slate-400">{campaign.client_name}</p>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-wide">
                                        {a.common.completed}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────

function CampaignCard({ campaign, isJoined, mySubmissions }: {
    campaign: CampaignResponse; isJoined: boolean; mySubmissions: SubmissionResponse[];
}) {
    const { t } = useLanguage();
    const a = t.app;
    const c = a.campaigns;

    const [showJoinForm, setShowJoinForm] = useState(false);
    const [showMyVideos, setShowMyVideos] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const budgetRemaining = campaign.total_budget - campaign.budget_spent;
    const budgetProgress = Math.round((campaign.budget_spent / campaign.total_budget) * 100);
    const viewProgress = Math.round((campaign.total_views_generated / campaign.view_target) * 100);

    function getSubStatusLabel(status: string) {
        if (status.includes("🟢 Active")) return a.status.activeEarning;
        if (status.includes("⏳")) return a.status.pendingReview;
        if (status.includes("📉")) return a.status.gainingViews;
        if (status.includes("🔴")) return a.status.rejected;
        return status;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoUrl) return;
        setSubmitting(true);
        // NOTE: No HTTP endpoint for submission yet — done via Discord bot !join command
        // This is a placeholder for future implementation
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitStatus("success");
        setVideoUrl("");
        setSubmitting(false);
        setTimeout(() => { setSubmitStatus("idle"); setShowJoinForm(false); }, 2500);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 border border-blue-200 flex items-center justify-center shrink-0">
                            <Megaphone size={22} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{campaign.campaign_name}</h3>
                            <p className="text-slate-500 text-sm font-medium">{campaign.client_name}</p>
                        </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shrink-0">
                        {a.common.active}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                            <DollarSign size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.rate}</span>
                        </div>
                        <p className="text-xl font-extrabold text-slate-900">฿{campaign.cost_per_thousand_views}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{c.per1kViews}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                            <Target size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.budgetLeft}</span>
                        </div>
                        <p className="text-xl font-extrabold text-emerald-600">฿{fmt(budgetRemaining)}</p>
                        <p className="text-[10px] text-slate-400 font-medium">of ฿{fmt(campaign.total_budget)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                            <TrendingUp size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.views}</span>
                        </div>
                        <p className="text-xl font-extrabold text-slate-900">{fmtViews(campaign.total_views_generated)}</p>
                        <p className="text-[10px] text-slate-400 font-medium">of {fmtViews(campaign.view_target)}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-2.5 mb-5">
                    <ProgressBar label={c.budgetUsed} progress={budgetProgress} color="bg-violet-500" />
                    <ProgressBar label={c.viewTarget} progress={viewProgress} color="bg-emerald-500" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                    {campaign.campaign_material_link && (
                        <a href={campaign.campaign_material_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-4 py-2 rounded-xl transition-colors">
                            <ExternalLink size={15} /> {c.campaignMaterials}
                        </a>
                    )}
                    {isJoined ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => setShowJoinForm(!showJoinForm)}
                                className="flex items-center gap-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-colors">
                                <LinkIcon size={15} /> {c.submitAnotherVideo}
                            </button>
                            {mySubmissions.length > 0 && (
                                <button onClick={() => setShowMyVideos(!showMyVideos)}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 px-3 py-2 rounded-xl transition-colors">
                                    {c.myVideos} ({mySubmissions.length})
                                    <ChevronDown size={15} className={`transition-transform ${showMyVideos ? "rotate-180" : ""}`} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setShowJoinForm(!showJoinForm)}
                            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 px-5 py-2.5 rounded-xl transition-opacity shadow-sm">
                            <Megaphone size={15} /> {c.joinCampaign}
                        </button>
                    )}
                </div>
            </div>

            {/* Join Form */}
            <AnimatePresence>
                {showJoinForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                            <p className="text-sm font-bold text-slate-700 mb-3">{c.submitVideoTitle}</p>
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <div className="flex-1 relative">
                                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="url" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder={c.urlPlaceholder}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 placeholder:text-slate-400" />
                                </div>
                                <button type="submit" disabled={submitting || !videoUrl}
                                    className="flex items-center gap-2 font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0">
                                    <Send size={15} />
                                    {submitting ? a.common.submitting : a.common.submit}
                                </button>
                            </form>
                            <AnimatePresence>
                                {submitStatus === "success" && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl mt-3">
                                        <CheckCircle2 size={16} /> {c.successMsg}
                                    </motion.div>
                                )}
                                {submitStatus === "error" && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl mt-3">
                                        <AlertCircle size={16} /> {c.errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* My Videos */}
            <AnimatePresence>
                {showMyVideos && mySubmissions.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="border-t border-slate-100">
                            <div className="px-6 py-3 bg-slate-50/50">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.mySubmissionsLabel}</p>
                            </div>
                            {mySubmissions.map((sub) => (
                                <div key={sub.id} className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-600 truncate">{sub.video_url.replace("https://", "")}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{fmtViews(sub.play_count)} {a.campaigns.views}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        {sub.calculated_payout > 0 && (
                                            <span className="text-xs font-bold text-emerald-600">฿{fmt(sub.calculated_payout)}</span>
                                        )}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusStyle(sub.status)}`}>
                                            {getSubStatusLabel(sub.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProgressBar({ label, progress, color }: { label: string; progress: number; color: string }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <span className="text-xs font-bold text-slate-700">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
        </div>
    );
}
