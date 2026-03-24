"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CheckCircle2, AlertCircle, Clock, Building2, ArrowDownToLine, Info, XCircle, Ban } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { requestJson } from "@/lib/clientApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useMe, usePayouts } from "@/lib/portalApi";
import type { PayoutResponse } from "@/lib/portalApi";
import { MOCK_CLIPPER, MOCK_PAYOUTS } from "@/modules/app-portal/mockData";
import { resolvePortalRole, ROLE_PERMISSIONS } from "@/modules/app-portal/roleConfig";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtDate = (value: string) => new Date(value).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
const PRESET_AMOUNTS = [500, 1000, 5000, 10000];

function getPayoutStatusStyle(status: string) {
    if (status.includes("✅")) return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
    if (status.includes("⏳")) return { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
    if (status.includes("❌")) return { badge: "bg-rose-100 text-rose-700 border-rose-200", icon: <XCircle size={14} /> };
    if (status.includes("🚫")) return { badge: "bg-slate-100 text-slate-600 border-slate-200", icon: <Ban size={14} /> };
    return { badge: "bg-slate-100 text-slate-600 border-slate-200", icon: <Clock size={14} /> };
}

function BalanceSkeleton() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-7 shadow-lg animate-pulse">
            <div className="h-4 bg-white/20 rounded w-32 mb-2" />
            <div className="h-12 bg-white/30 rounded w-48 mb-1" />
            <div className="h-3 bg-white/20 rounded w-56" />
        </div>
    );
}

export function WithdrawPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const a = t.app;
    const w = a.withdraw;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: clipper, loading: meLoading, error: meError, refetch: refetchMe } = useMe();
    const { data: payouts, loading: payoutsLoading, error: payoutsError, refetch: refetchPayouts } = usePayouts();

    const shouldMockMe = shouldUsePortalMockData(Boolean(meError) && !meLoading);
    const shouldMockPayouts = shouldUsePortalMockData(Boolean(payoutsError) && !payoutsLoading);
    const isMockMode = shouldMockMe || shouldMockPayouts;

    const clipperData = shouldMockMe ? MOCK_CLIPPER : (clipper ?? null);
    const payoutData = shouldMockPayouts ? MOCK_PAYOUTS : (payouts ?? []);
    const filteredPayouts = searchQuery
        ? payoutData.filter((payout) => [payout.status, payout.bank_type, payout.reason, String(payout.amount)].join(" ").toLowerCase().includes(searchQuery))
        : payoutData;

    const role = resolvePortalRole(clipperData);
    const rolePermissions = ROLE_PERMISSIONS[role];

    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const pendingBalance = clipperData?.pending_balance ?? 0;
    const parsedAmount = parseInt(amount, 10);
    const numericAmount = Number(amount);
    const minWithdrawAmount = rolePermissions.minWithdrawAmount;
    const isIntegerAmount = amount.trim() !== "" && Number.isInteger(numericAmount);
    const isValidAmount = isIntegerAmount && parsedAmount >= minWithdrawAmount && parsedAmount <= pendingBalance;

    const hasPendingRequest = payoutData.some((payout: PayoutResponse) => payout.status.includes("⏳"));

    function getPayoutStatusLabel(status: string) {
        if (status.includes("✅")) return a.status.paid;
        if (status.includes("⏳")) return a.status.pending;
        if (status.includes("❌")) return a.status.rejected;
        if (status.includes("🚫")) return a.status.cancelled;
        return status;
    }

    const validationMessage = () => {
        if (!amount) return null;
        if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !Number.isInteger(numericAmount)) return { type: "error", text: w.validation.invalid };
        if (parsedAmount < minWithdrawAmount) return { type: "error", text: `ขั้นต่ำ ${fmt(minWithdrawAmount)} บาท` };
        if (parsedAmount > pendingBalance) return { type: "error", text: w.validation.insufficient };
        return {
            type: "ok",
            text: w.validation.ok
                .replace("{amount}", fmt(parsedAmount))
                .replace("{bank}", clipperData?.bank_type ?? "")
                .replace("{no}", clipperData?.bank_no ?? ""),
        };
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidAmount) return;

        setSubmitting(true);
        setSubmitStatus("idle");
        setSubmitMessage(null);

        try {
            await requestJson("/api/portal/payouts", {
                method: "POST",
                body: JSON.stringify({ amount: parsedAmount }),
            });
            setSubmitStatus("success");
            setSubmitMessage(w.successMsg);
            setAmount("");
            refetchMe();
            refetchPayouts();
            setTimeout(() => {
                setSubmitStatus("idle");
                setSubmitMessage(null);
            }, 3000);
        } catch (requestError) {
            setSubmitStatus("error");
            setSubmitMessage(requestError instanceof Error ? requestError.message : "Unable to request payout");
        } finally {
            setSubmitting(false);
        }
    };

    const validation = validationMessage();

    return (
        <div className="space-y-7 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{w.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{w.subtitle}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1.5">
                    <span className={`w-2 h-2 rounded-full ${role === "vip" ? "bg-amber-400" : "bg-slate-400"}`} />
                    Role: {role.toUpperCase()} · ถอนขั้นต่ำ ฿{fmt(minWithdrawAmount)}
                </div>
            </div>

            {isMockMode && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {meError && <span className="block text-xs mt-1">me: {meError}</span>}
                    {payoutsError && <span className="block text-xs">payouts: {payoutsError}</span>}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-5">
                    {meLoading && !shouldMockMe ? <BalanceSkeleton /> : (
                        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-7 text-white shadow-lg">
                            <p className="text-sm font-semibold text-blue-200 mb-1">{w.availableBalance}</p>
                            <p className="text-5xl font-extrabold mb-1">฿{fmt(pendingBalance)}</p>
                            <p className="text-blue-300 text-sm font-medium">{w.minNote} (ขั้นต่ำ ฿{fmt(minWithdrawAmount)})</p>
                            <div className="mt-5 pt-5 border-t border-white/20 flex items-center gap-6 text-sm">
                                <div>
                                    <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">{w.totalEarned}</p>
                                    <p className="font-bold text-white">฿{fmt(clipperData?.total_earnings ?? 0)}</p>
                                </div>
                                <div>
                                    <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">{w.totalPaidOut}</p>
                                    <p className="font-bold text-white">฿{fmt(clipperData?.paid_amount ?? 0)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasPendingRequest && (
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                            <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800">{w.pendingWarningTitle}</p>
                                <p className="text-xs text-amber-600 mt-0.5">{w.pendingWarningDesc}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <ArrowDownToLine size={18} className="text-slate-400" />
                            {w.requestWithdrawal}
                        </h2>
                        <form onSubmit={handleWithdraw} className="space-y-5">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{w.quickSelect}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {PRESET_AMOUNTS.map((preset) => (
                                        <button key={preset} type="button" onClick={() => setAmount(String(preset))}
                                            disabled={preset > pendingBalance}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${amount === String(preset) ? "bg-blue-600 text-white border-blue-600" : preset > pendingBalance ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed" : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600"}`}>
                                            ฿{fmt(preset)}
                                        </button>
                                    ))}
                                    <button type="button"
                                        onClick={() => setAmount(String(Math.floor(pendingBalance)))}
                                        disabled={pendingBalance < 100}
                                        className="px-4 py-2 rounded-xl text-sm font-bold border bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all">
                                        {w.max}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{w.amountLabel}</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">฿</span>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                        min={minWithdrawAmount} step={1} max={Math.floor(pendingBalance)} placeholder="0"
                                        className="w-full pl-8 pr-4 py-3.5 text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                </div>
                                <AnimatePresence>
                                    {validation && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className={`flex items-center gap-2 text-xs font-semibold mt-2 ${validation.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>
                                            {validation.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                            {validation.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {(!meLoading || shouldMockMe) && clipperData && (
                                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                        <Building2 size={18} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{clipperData.bank_type || "ยังไม่มีบัญชีธนาคาร"}</p>
                                        <p className="text-xs text-slate-400 font-medium">{clipperData.bank_no || "-"}</p>
                                    </div>
                                    {clipperData.bank_no && (
                                        <div className="ml-auto">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">{w.verified}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button type="submit"
                                disabled={!isValidAmount || submitting || hasPendingRequest || (meLoading && !shouldMockMe) || !clipperData?.bank_no}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                <Wallet size={18} />
                                {submitting ? w.processing : w.requestWithdrawal}
                            </button>

                            <AnimatePresence>
                                {submitStatus === "success" && (
                                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
                                        <CheckCircle2 size={16} /> {submitMessage ?? w.successMsg}
                                    </motion.div>
                                )}
                                {submitStatus === "error" && (
                                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
                                        <AlertCircle size={16} /> {submitMessage ?? "Unable to request payout"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                            <Info size={16} className="text-slate-400" /> {w.rulesTitle}
                        </h3>
                        <ul className="space-y-2.5">
                            {w.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-sm">{w.history}</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {payoutsLoading && !shouldMockPayouts ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-4 bg-slate-200 rounded w-20" />
                                            <div className="h-3 bg-slate-100 rounded w-16" />
                                        </div>
                                        <div className="h-5 bg-slate-200 rounded w-16" />
                                    </div>
                                ))
                            ) : filteredPayouts.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-8">
                                    {searchQuery ? `No payouts match "${searchQuery}"` : w.noPayouts}
                                </p>
                            ) : (
                                filteredPayouts.map((payout: PayoutResponse) => {
                                    const { badge, icon } = getPayoutStatusStyle(payout.status);
                                    return (
                                        <div key={payout.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700">฿{fmt(payout.amount)}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{fmtDate(payout.created_at)}</p>
                                                {payout.reason && <p className="text-[11px] text-rose-500 mt-0.5">{payout.reason}</p>}
                                            </div>
                                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${badge}`}>
                                                {icon} {getPayoutStatusLabel(payout.status)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
