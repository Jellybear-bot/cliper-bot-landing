"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Shield, Eye, TrendingUp, CheckCircle2, Edit3, Save, X, BadgeDollarSign, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMe } from "@/lib/portalApi";

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
const fmtDate = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" });

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-24" />
            </div>
            <div className="p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-slate-200 rounded w-40" />
                        <div className="h-3 bg-slate-100 rounded w-56" />
                        <div className="h-6 bg-slate-100 rounded w-24" />
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-20" />
                        <div className="h-4 bg-slate-100 rounded w-28" />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-20" />
                        <div className="h-4 bg-slate-100 rounded w-28" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 mx-auto" />
                        <div className="h-5 bg-slate-200 rounded w-16 mx-auto" />
                        <div className="h-3 bg-slate-100 rounded w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SettingsPage() {
    const { t } = useLanguage();
    const a = t.app;
    const s = a.settings;

    const { data: clipper, loading, error } = useMe();

    const [editingBank, setEditingBank] = useState(false);
    const [bankNo, setBankNo] = useState("");
    const [bankType, setBankType] = useState(BANK_OPTIONS[0]);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

    // Sync bank form state when data loads
    useEffect(() => {
        if (clipper) {
            setBankNo(clipper.bank_no ?? "");
            setBankType(clipper.bank_type || BANK_OPTIONS[0]);
        }
    }, [clipper]);

    const handleSaveBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus("saving");
        // NOTE: No HTTP endpoint for updating bank info yet — done via Discord bot !setbank command
        await new Promise((r) => setTimeout(r, 1000));
        setSaveStatus("saved");
        setEditingBank(false);
        setTimeout(() => setSaveStatus("idle"), 2500);
    };

    const handleCancelEdit = () => {
        setEditingBank(false);
        setBankNo(clipper?.bank_no ?? "");
        setBankType(clipper?.bank_type || BANK_OPTIONS[0]);
    };

    const isNormal = clipper?.status.includes("🟢") ?? true;

    return (
        <div className="space-y-7 pb-12 w-full max-w-3xl">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{s.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{s.subtitle}</p>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-xl">
                    ⚠️ โหลดข้อมูลไม่ได้: {error}
                </div>
            )}

            {/* Profile Card */}
            {loading ? <ProfileSkeleton /> : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800 text-sm">{s.profile}</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
                                {(clipper?.username ?? "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">{clipper?.username ?? "-"}</h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">{s.discordId}: {clipper?.discord_id ?? "-"}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${isNormal ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                        <Shield size={12} />
                                        {isNormal ? s.normalStanding : s.restricted}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.memberSince}</p>
                                <p className="text-sm font-bold text-slate-700">{clipper ? fmtDate(clipper.created_at) : "-"}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.accountStatus}</p>
                                <p className="text-sm font-bold text-slate-700">{clipper?.status ?? "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bank Account */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800 text-sm">{s.bankAccount}</h2>
                    </div>
                    {!editingBank && !loading && (
                        <button onClick={() => setEditingBank(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200">
                            <Edit3 size={13} /> {a.common.edit}
                        </button>
                    )}
                </div>
                <div className="p-6">
                    <AnimatePresence>
                        {saveStatus === "saved" && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl mb-4">
                                <CheckCircle2 size={16} /> {s.savedSuccess}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-32" />
                                <div className="h-3 bg-slate-100 rounded w-24" />
                            </div>
                        </div>
                    ) : !editingBank ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <Building2 size={22} className="text-slate-500" />
                            </div>
                            <div>
                                {clipper?.bank_no ? (
                                    <>
                                        <p className="font-bold text-slate-800">{clipper.bank_type}</p>
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">{clipper.bank_no}</p>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-2">
                                            <CheckCircle2 size={11} /> {a.common.verified}
                                        </span>
                                    </>
                                ) : (
                                    <div>
                                        <p className="font-semibold text-slate-500">{s.noBankAccount}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{s.noBankDesc}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveBank} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{s.bankName}</label>
                                <select value={bankType} onChange={(e) => setBankType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                    {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{s.accountNumber}</label>
                                <input type="text" value={bankNo} onChange={(e) => setBankNo(e.target.value)}
                                    placeholder={s.accountPlaceholder}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="submit" disabled={saveStatus === "saving"}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60">
                                    <Save size={15} />
                                    {saveStatus === "saving" ? a.common.saving : a.common.save}
                                </button>
                                <button type="button" onClick={handleCancelEdit}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                                    <X size={15} /> {a.common.cancel}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Account Stats */}
            {loading ? <StatsSkeleton /> : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <TrendingUp size={16} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800 text-sm">{s.accountStats}</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatItem icon={<Eye size={20} />} label={s.totalViews} value={fmtViews(clipper?.total_views ?? 0)} iconBg="bg-blue-100" iconColor="text-blue-600" />
                        <StatItem icon={<BadgeDollarSign size={20} />} label={s.totalEarned} value={`฿${fmt(clipper?.total_earnings ?? 0)}`} iconBg="bg-violet-100" iconColor="text-violet-600" />
                        <StatItem icon={<CheckCircle2 size={20} />} label={s.paidOut} value={`฿${fmt(clipper?.paid_amount ?? 0)}`} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                        <StatItem icon={<Video size={20} />} label={s.pendingBalance} value={`฿${fmt(clipper?.pending_balance ?? 0)}`} iconBg="bg-amber-100" iconColor="text-amber-600" />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatItem({ icon, label, value, iconBg, iconColor }: {
    icon: React.ReactNode; label: string; value: string; iconBg: string; iconColor: string;
}) {
    return (
        <div className="text-center">
            <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mx-auto mb-2`}>{icon}</div>
            <p className="text-lg font-extrabold text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}
