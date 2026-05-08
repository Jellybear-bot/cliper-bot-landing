"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Shield, Eye, TrendingUp, CheckCircle2, Edit3, Save, X, BadgeDollarSign, Video, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { requestJson } from "@/lib/clientApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useMe } from "@/lib/portalApi";
import { MOCK_CLIPPER } from "@/modules/app-portal/mockData";

const BANK_OPTIONS = [
    "กสิกรไทย (KBANK)", "กรุงเทพ (BBL)", "ไทยพาณิชย์ (SCB)",
    "กรุงไทย (KTB)", "กรุงศรี (BAY)", "ทีทีบี (TTB)", "ออมสิน", "อาคารสงเคราะห์ (GHB)",
];

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return fmt(n);
};
const fmtDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" });
};

function ProfileSkeleton() {
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
            </div>
            <div className="p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-white/10 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-40" />
                        <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-56" />
                        <div className="h-6 bg-slate-100 dark:bg-white/8 rounded w-24" />
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/8 space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20" />
                        <div className="h-4 bg-slate-100 dark:bg-white/8 rounded w-28" />
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/8 space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20" />
                        <div className="h-4 bg-slate-100 dark:bg-white/8 rounded w-28" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32" />
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 mx-auto" />
                        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-16 mx-auto" />
                        <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SettingsPage() {
    const { t } = useLanguage();
    const a = t.app;
    const s = a.settings;

    const { data: clipper, loading, error, refetch } = useMe();
    const shouldMockMe = shouldUsePortalMockData(Boolean(error) && !loading);
    const clipperData = shouldMockMe ? MOCK_CLIPPER : (clipper ?? null);

    const [editingBank, setEditingBank] = useState(false);
    const [bankNo, setBankNo] = useState("");
    const [bankType, setBankType] = useState(BANK_OPTIONS[0]);
    const [bankAccountName, setBankAccountName] = useState("");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        if (clipperData) {
            setBankNo(clipperData.bank_no ?? "");
            setBankType(clipperData.bank_type || BANK_OPTIONS[0]);
            setBankAccountName(clipperData.bank_account_name ?? "");
        }
    }, [clipperData]);

    const handleSaveBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus("saving");
        setSaveMessage(null);

        try {
            await requestJson("/api/portal/me/bank", {
                method: "PATCH",
                body: JSON.stringify({ bankNo, bankType, bankAccountName }),
            });
            setSaveStatus("saved");
            setSaveMessage(s.savedSuccess);
            setEditingBank(false);
            refetch();
            setTimeout(() => {
                setSaveStatus("idle");
                setSaveMessage(null);
            }, 2500);
        } catch (requestError) {
            setSaveStatus("error");
            setSaveMessage(requestError instanceof Error ? requestError.message : "Unable to update bank account");
        }
    };

    const handleCancelEdit = () => {
        setEditingBank(false);
        setBankNo(clipperData?.bank_no ?? "");
        setBankType(clipperData?.bank_type || BANK_OPTIONS[0]);
        setBankAccountName(clipperData?.bank_account_name ?? "");
        setSaveStatus("idle");
        setSaveMessage(null);
    };

    const isNormal = clipperData?.status.includes("🟢") ?? true;

    return (
        <div className="space-y-7 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{s.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{s.subtitle}</p>
            </div>

            {shouldMockMe && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {error && <span className="block text-xs mt-1">me: {error}</span>}
                </div>
            )}

            {loading && !shouldMockMe ? <ProfileSkeleton /> : (
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center gap-2">
                        <User size={16} className="text-slate-400 dark:text-slate-500" />
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{s.profile}</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
                                {(clipperData?.username ?? "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{clipperData?.username ?? "-"}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.discordId}: {clipperData?.discord_id ?? "-"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${isNormal ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"}`}>
                                        <Shield size={12} />
                                        {isNormal ? s.normalStanding : s.restricted}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/8">
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{s.memberSince}</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{clipperData ? fmtDate(clipperData.created_at) : "-"}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/8">
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{s.accountStatus}</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{clipperData?.status ?? "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400 dark:text-slate-500" />
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{s.bankAccount}</h2>
                    </div>
                    {!editingBank && (!loading || shouldMockMe) && (
                        <button
                            onClick={() => setEditingBank(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors border border-blue-200 dark:border-blue-500/20"
                        >
                            <Edit3 size={13} /> {a.common.edit}
                        </button>
                    )}
                </div>
                <div className="p-6">
                    <AnimatePresence>
                        {saveStatus === "saved" && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 rounded-xl mb-4">
                                <CheckCircle2 size={16} /> {saveMessage ?? s.savedSuccess}
                            </motion.div>
                        )}
                        {saveStatus === "error" && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-3 rounded-xl mb-4">
                                <AlertCircle size={16} /> {saveMessage ?? "Unable to update bank account"}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading && !shouldMockMe ? (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32" />
                                <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-24" />
                            </div>
                        </div>
                    ) : !editingBank ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                <Building2 size={22} className="text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                                {clipperData?.bank_no ? (
                                    <>
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{clipperData.bank_type}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{clipperData.bank_no}</p>
                                        {clipperData.bank_account_name && (
                                            <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{clipperData.bank_account_name}</p>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-md mt-2">
                                            <CheckCircle2 size={11} /> {a.common.verified}
                                        </span>
                                    </>
                                ) : (
                                    <div>
                                        <p className="font-semibold text-slate-500 dark:text-slate-400">{s.noBankAccount}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.noBankDesc}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveBank} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{s.bankName}</label>
                                <select
                                    value={bankType}
                                    onChange={(e) => setBankType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    {BANK_OPTIONS.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{s.accountName}</label>
                                <input
                                    type="text"
                                    value={bankAccountName}
                                    onChange={(e) => setBankAccountName(e.target.value)}
                                    placeholder={s.accountNamePlaceholder}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{s.accountNumber}</label>
                                <input
                                    type="text"
                                    value={bankNo}
                                    onChange={(e) => setBankNo(e.target.value)}
                                    placeholder={s.accountPlaceholder}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={saveStatus === "saving"}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                                >
                                    <Save size={15} />
                                    {saveStatus === "saving" ? a.common.saving : a.common.save}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    <X size={15} /> {a.common.cancel}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {loading && !shouldMockMe ? <StatsSkeleton /> : (
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/8 flex items-center gap-2">
                        <TrendingUp size={16} className="text-slate-400 dark:text-slate-500" />
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{s.accountStats}</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatItem icon={<Eye size={20} />} label={s.totalViews} value={fmtViews(clipperData?.total_views ?? 0)} iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400" />
                        <StatItem icon={<BadgeDollarSign size={20} />} label={s.totalEarned} value={`฿${fmt(clipperData?.total_earnings ?? 0)}`} iconBg="bg-violet-100 dark:bg-violet-500/20" iconColor="text-violet-600 dark:text-violet-400" />
                        <StatItem icon={<CheckCircle2 size={20} />} label={s.paidOut} value={`฿${fmt(clipperData?.paid_amount ?? 0)}`} iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconColor="text-emerald-600 dark:text-emerald-400" />
                        <StatItem icon={<Video size={20} />} label={s.pendingBalance} value={`฿${fmt(clipperData?.pending_balance ?? 0)}`} iconBg="bg-amber-100 dark:bg-amber-500/20" iconColor="text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatItem({ icon, label, value, iconBg, iconColor }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="text-center">
            <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mx-auto mb-2`}>{icon}</div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
    );
}
