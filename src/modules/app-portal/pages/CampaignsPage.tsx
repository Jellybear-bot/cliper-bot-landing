"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, ExternalLink, Send, CheckCircle2, AlertCircle, Link as LinkIcon, TrendingUp, Target, DollarSign, ChevronDown, FileText, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { requestJson } from "@/lib/clientApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useCampaigns, useMe, useSubmissions } from "@/lib/portalApi";
import type { CampaignResponse, SubmissionResponse } from "@/lib/portalApi";
import { MOCK_CAMPAIGNS, MOCK_CLIPPER, MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";
import { isVipCampaign, resolvePortalRole, ROLE_PERMISSIONS } from "@/modules/app-portal/roleConfig";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return fmt(n);
};

function getStatusStyle(status: string) {
    if (status.includes("🟢")) return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
    if (status.includes("⏳")) return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400";
    if (status.includes("🔴") || status.includes("❌")) return "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400";
    if (status.includes("📉")) return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400";
    return "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400";
}

function CampaignSkeleton() {
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-48" />
                    <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-32" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 h-20 border border-slate-100 dark:border-white/8" />
                ))}
            </div>
            <div className="h-8 bg-slate-100 dark:bg-white/8 rounded-xl w-32" />
        </div>
    );
}

export function CampaignsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const a = t.app;
    const c = a.campaigns;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: clipper, loading: meLoading, error: meError } = useMe();
    const { data: campaigns, loading, error } = useCampaigns();
    const { data: mySubmissions, loading: submissionsLoading, error: submissionsError, refetch: refetchSubmissions } = useSubmissions();

    const shouldMockMe = shouldUsePortalMockData(Boolean(meError) && !meLoading);
    const shouldMockCampaigns = shouldUsePortalMockData(Boolean(error) && !loading);
    const shouldMockSubmissions = shouldUsePortalMockData(Boolean(submissionsError) && !submissionsLoading);
    const isMockMode = shouldMockCampaigns || shouldMockSubmissions;

    const clipperData = shouldMockMe ? MOCK_CLIPPER : (clipper ?? null);
    const role = resolvePortalRole(clipperData);
    const rolePermissions = ROLE_PERMISSIONS[role];

    const campaignsData = shouldMockCampaigns ? MOCK_CAMPAIGNS : (campaigns ?? []);
    const submissionsData = shouldMockSubmissions ? MOCK_SUBMISSIONS : (mySubmissions ?? []);

    const filteredCampaigns = searchQuery
        ? campaignsData.filter((campaign) => {
            const haystack = [campaign.campaign_name, campaign.client_name, campaign.campaign_description, campaign.status].join(" ").toLowerCase();
            return haystack.includes(searchQuery);
        })
        : campaignsData;

    const activeCampaigns = filteredCampaigns.filter((campaign) => campaign.status.includes("🟢"));
    const completedCampaigns = filteredCampaigns.filter((campaign) => campaign.status.includes("🔴"));
    const joinedCampaignNames = new Set(submissionsData.map((submission) => submission.campaign_name));

    return (
        <div className="space-y-8 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{c.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{c.subtitle}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-3 py-1.5">
                    <span className={`w-2 h-2 rounded-full ${role === "vip" ? "bg-amber-400" : "bg-slate-400 dark:bg-slate-500"}`} />
                    Role: {role.toUpperCase()} · ส่งได้สูงสุด {rolePermissions.dailySubmissionLimit} วิดีโอ/วัน
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">{c.howItWorks}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    {[c.step1, c.step2, c.step3].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <p className="text-blue-700 dark:text-blue-300 font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {isMockMode && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {error && <span className="block text-xs mt-1">campaigns: {error}</span>}
                    {submissionsError && <span className="block text-xs">submissions: {submissionsError}</span>}
                    {meError && <span className="block text-xs">me: {meError}</span>}
                </div>
            )}

            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {c.activeCampaigns} {(!loading || shouldMockCampaigns) && `(${activeCampaigns.length})`}
                </h2>
                <div className="space-y-4">
                    {loading && !shouldMockCampaigns ? (
                        Array.from({ length: 2 }).map((_, i) => <CampaignSkeleton key={i} />)
                    ) : activeCampaigns.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                            <Megaphone size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-400 dark:text-slate-500 font-medium">
                                {searchQuery ? `No active campaigns match "${searchQuery}"` : "ไม่มีแคมเปญที่เปิดรับในขณะนี้"}
                            </p>
                        </div>
                    ) : (
                        activeCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                isJoined={joinedCampaignNames.has(campaign.campaign_name)}
                                mySubmissions={submissionsData.filter((submission) => submission.campaign_name === campaign.campaign_name)}
                                rolePermissions={rolePermissions}
                                onSubmitted={refetchSubmissions}
                            />
                        ))
                    )}
                </div>
            </div>

            {completedCampaigns.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-500 dark:text-slate-500 mb-4">{c.completedCampaigns}</h2>
                    <div className="space-y-3">
                        {completedCampaigns.map((campaign) => (
                            <div key={campaign.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-slate-600 dark:text-slate-300">{campaign.campaign_name}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{campaign.client_name}</p>
                                        {(campaign.campaign_description?.trim()) && (
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                {campaign.campaign_description}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
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

function CampaignCard({
    campaign,
    isJoined,
    mySubmissions,
    rolePermissions,
    onSubmitted,
}: {
    campaign: CampaignResponse;
    isJoined: boolean;
    mySubmissions: SubmissionResponse[];
    rolePermissions: { canAccessVipCampaign: boolean; payoutBonusPercent: number };
    onSubmitted: () => void;
}) {
    const { t } = useLanguage();
    const a = t.app;
    const c = a.campaigns;

    const [showJoinForm, setShowJoinForm] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showMyVideos, setShowMyVideos] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const clipperBudget = campaign.total_budget * (1 - (campaign.platform_fee_rate ?? 0.3));
    const budgetRemaining = clipperBudget - campaign.budget_spent;
    const budgetProgress = Math.round((campaign.budget_spent / clipperBudget) * 100);

    const t1 = campaign.tier_one_threshold ?? 50000;
    const t2 = campaign.tier_two_threshold ?? 200000;
    const t3 = campaign.tier_three_threshold ?? 1000000;
    function getTierInfo(views: number) {
        if (views < t1) return { label: "Tier 1", mult: 1.0, color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" };
        if (views < t2) return { label: "Tier 2", mult: campaign.tier_two_mult ?? 0.8, color: "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400" };
        if (views < t3) return { label: "Tier 3", mult: campaign.tier_three_mult ?? 0.6, color: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400" };
        return { label: "Tier 4", mult: campaign.tier_four_mult ?? 0.4, color: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400" };
    }
    const viewProgress = Math.round((campaign.total_views_generated / campaign.view_target) * 100);
    const isViewsGrowing = campaign.total_views_generated > 0;
    const isBudgetDepleted = budgetRemaining <= 0;
    const vipCampaign = isVipCampaign(campaign);
    const canJoinCampaign = !vipCampaign || rolePermissions.canAccessVipCampaign;
    const campaignDetails = campaign.campaign_description?.trim() || c.noCampaignDetails;

    function openDetailsBeforeSubmit() {
        setSubmitStatus("idle");
        setSubmitMessage(null);
        setShowDetailsModal(true);
    }

    function acknowledgeDetailsAndOpenForm() {
        setShowDetailsModal(false);
        setShowJoinForm(true);
    }

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
        setSubmitStatus("idle");
        setSubmitMessage(null);

        try {
            await requestJson("/api/portal/submissions", {
                method: "POST",
                body: JSON.stringify({
                    campaignId: campaign.id,
                    campaignName: campaign.campaign_name,
                    videoUrl,
                }),
            });

            setSubmitStatus("success");
            setSubmitMessage(c.successMsg);
            setVideoUrl("");
            onSubmitted();

            setTimeout(() => {
                setSubmitStatus("idle");
                setSubmitMessage(null);
                setShowJoinForm(false);
            }, 2500);
        } catch (error) {
            setSubmitStatus("error");
            setSubmitMessage(error instanceof Error ? error.message : c.errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-500/20 dark:to-violet-500/20 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0">
                            <Megaphone size={22} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg leading-tight">{campaign.campaign_name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{campaign.client_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {vipCampaign && (
                            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                                VIP
                            </span>
                        )}
                        <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                            {a.common.active}
                        </span>
                    </div>
                </div>

                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <div className="mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <FileText size={16} />
                        <p className="text-sm font-extrabold">{c.campaignDetails}</p>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {campaignDetails}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-100 dark:border-white/8">
                        <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                            <DollarSign size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.rate}</span>
                        </div>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">฿{campaign.cost_per_thousand_views}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {c.per1kViews}{rolePermissions.payoutBonusPercent > 0 ? ` (+${rolePermissions.payoutBonusPercent}% VIP)` : ""}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-100 dark:border-white/8">
                        <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                            <Target size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.budgetLeft}</span>
                        </div>
                        <p className={`text-xl font-extrabold ${isBudgetDepleted ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>฿{fmt(budgetRemaining)}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">of ฿{fmt(clipperBudget)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-100 dark:border-white/8">
                        <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-1">
                            <TrendingUp size={14} className={isViewsGrowing ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{c.views}</span>
                        </div>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{fmtViews(campaign.total_views_generated)}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">of {fmtViews(campaign.view_target)}</p>
                    </div>
                </div>

                <div className="space-y-2.5 mb-5">
                    <ProgressBar label={c.budgetUsed} progress={budgetProgress} color="bg-violet-500" />
                    <ProgressBar label={c.viewTarget} progress={viewProgress} color="bg-emerald-500" />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {campaign.campaign_material_link && (
                        <a
                            href={campaign.campaign_material_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 px-4 py-2 rounded-xl transition-colors"
                        >
                            <ExternalLink size={15} /> {c.campaignMaterials}
                        </a>
                    )}
                    {isJoined ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={openDetailsBeforeSubmit}
                                disabled={!canJoinCampaign}
                                className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 hover:bg-blue-100 dark:hover:bg-blue-500/25 border border-blue-200 dark:border-blue-500/20 px-4 py-2 rounded-xl transition-colors"
                            >
                                <LinkIcon size={15} /> {c.submitAnotherVideo}
                            </button>
                            {mySubmissions.length > 0 && (
                                <button
                                    onClick={() => setShowMyVideos(!showMyVideos)}
                                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 px-3 py-2 rounded-xl transition-colors"
                                >
                                    {c.myVideos} ({mySubmissions.length})
                                    <ChevronDown size={15} className={`transition-transform ${showMyVideos ? "rotate-180" : ""}`} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={openDetailsBeforeSubmit}
                            disabled={!canJoinCampaign}
                            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 px-5 py-2.5 rounded-xl transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Megaphone size={15} /> {canJoinCampaign ? c.joinCampaign : "สำหรับ VIP เท่านั้น"}
                        </button>
                    )}
                </div>

                {!canJoinCampaign && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-3 py-2 mt-3">
                        แคมเปญนี้เป็น VIP campaign กรุณาอัปเกรดบัญชีเพื่อเข้าร่วม
                    </p>
                )}
            </div>

            <AnimatePresence>
                {showDetailsModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDetailsModal(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`campaign-details-${campaign.id}`}
                    >
                        <motion.div
                            className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
                            initial={{ scale: 0.96, y: 12 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.96, y: 12 }}
                            transition={{ duration: 0.18 }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                                        {c.campaignDetails}
                                    </p>
                                    <h3 id={`campaign-details-${campaign.id}`} className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">
                                        {c.readDetailsTitle}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDetailsModal(false)}
                                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 px-5 py-5">
                                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                    <p className="text-sm font-semibold leading-6">{c.readDetailsWarning}</p>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">{campaign.campaign_name}</p>
                                    <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                        <p className="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-200">
                                            {campaignDetails}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowDetailsModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                                >
                                    {a.common.cancel}
                                </button>
                                <button
                                    type="button"
                                    onClick={acknowledgeDetailsAndOpenForm}
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                                >
                                    {c.readDetailsConfirm}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showJoinForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="border-t border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02] p-6">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">{c.submitVideoTitle}</p>
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <div className="flex-1 relative">
                                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <input
                                        type="url"
                                        required
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder={c.urlPlaceholder}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !videoUrl}
                                    className="flex items-center gap-2 font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                                >
                                    <Send size={15} />
                                    {submitting ? a.common.submitting : a.common.submit}
                                </button>
                            </form>
                            <AnimatePresence>
                                {submitStatus === "success" && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-2.5 rounded-xl mt-3">
                                        <CheckCircle2 size={16} /> {submitMessage ?? c.successMsg}
                                    </motion.div>
                                )}
                                {submitStatus === "error" && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-2.5 rounded-xl mt-3">
                                        <AlertCircle size={16} /> {submitMessage ?? c.errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMyVideos && mySubmissions.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="border-t border-slate-100 dark:border-white/8">
                            <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/[0.02]">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c.mySubmissionsLabel}</p>
                            </div>
                            {mySubmissions.map((submission) => (
                                <div key={submission.id} className="flex items-center gap-4 px-6 py-3 border-t border-slate-100 dark:border-white/8 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={submission.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 truncate"
                                        >
                                            <span className="truncate">{submission.video_url.replace("https://", "")}</span>
                                            <ExternalLink size={12} className="shrink-0" />
                                        </a>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{fmtViews(submission.play_count)} {a.campaigns.views}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {submission.calculated_payout > 0 && (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">฿{fmt(submission.calculated_payout)}</span>
                                        )}
                                        {(() => { const tier = getTierInfo(submission.play_count); return (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tier.color}`} title={`อัตรา ${(tier.mult * 100).toFixed(0)}% ของ CPM`}>
                                                {tier.label}
                                            </span>
                                        ); })()}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusStyle(submission.status)}`}>
                                            {getSubStatusLabel(submission.status)}
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
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
        </div>
    );
}
