"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CheckCircle2, AlertCircle, Clock, Building2, ArrowDownToLine, Info, XCircle, Ban, Save, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { requestJson } from "@/lib/clientApi";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useMe, usePayouts } from "@/lib/portalApi";
import type { PayoutResponse } from "@/lib/portalApi";
import { MOCK_CLIPPER, MOCK_PAYOUTS } from "@/modules/app-portal/mockData";
import { resolvePortalRole, ROLE_PERMISSIONS } from "@/modules/app-portal/roleConfig";

const BANK_OPTIONS = [
    "กสิกรไทย (KBANK)", "กรุงเทพ (BBL)", "ไทยพาณิชย์ (SCB)",
    "กรุงไทย (KTB)", "กรุงศรี (BAY)", "ทีทีบี (TTB)", "ออมสิน", "อาคารสงเคราะห์ (GHB)",
];

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtDate = (value: string) => new Date(value).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
const PRESET_AMOUNTS = [500, 1000, 5000, 10000];

function getPayoutStatusStyle(status: string) {
    if (status.includes("✅")) return { badge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", icon: <CheckCircle2 size={14} /> };
    if (status.includes("⏳")) return { badge: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", icon: <Clock size={14} /> };
    if (status.includes("❌")) return { badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20", icon: <XCircle size={14} /> };
    if (status.includes("🚫")) return { badge: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10", icon: <Ban size={14} /> };
    return { badge: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10", icon: <Clock size={14} /> };
}

function BalanceSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-7 shadow-xl shadow-blue-500/20 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-32 mb-3" />
            <div className="h-14 bg-white/30 rounded w-48 mb-2" />
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

    const [showBankModal, setShowBankModal] = useState(false);
    const [modalBankType, setModalBankType] = useState(BANK_OPTIONS[0]);
    const [modalBankName, setModalBankName] = useState("");
    const [modalBankNo, setModalBankNo] = useState("");
    const [modalSaveStatus, setModalSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [modalSaveMessage, setModalSaveMessage] = useState<string | null>(null);

    const isBankComplete = Boolean(clipperData?.bank_no && clipperData?.bank_type && clipperData?.bank_account_name);

    const openBankModal = () => {
        setModalBankType(clipperData?.bank_type || BANK_OPTIONS[0]);
        setModalBankName(clipperData?.bank_account_name ?? "");
        setModalBankNo(clipperData?.bank_no ?? "");
        setModalSaveStatus("idle");
        setModalSaveMessage(null);
        setShowBankModal(true);
    };

    const handleSaveBankModal = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalSaveStatus("saving");
        setModalSaveMessage(null);
        try {
            await requestJson("/api/portal/me/bank", {
                method: "PATCH",
                body: JSON.stringify({ bankNo: modalBankNo, bankType: modalBankType, bankAccountName: modalBankName }),
            });
            setModalSaveStatus("saved");
            setModalSaveMessage("อัปเดตบัญชีธนาคารสำเร็จ!");
            refetchMe();
            setTimeout(() => {
                setShowBankModal(false);
                setModalSaveStatus("idle");
                setModalSaveMessage(null);
            }, 1200);
        } catch (err) {
            setModalSaveStatus("error");
            setModalSaveMessage(err instanceof Error ? err.message : "ไม่สามารถบันทึกได้");
        }
    };

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
        <>
        <div className="space-y-7 pb-12 w-full">
            {/* Page header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{w.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{w.subtitle}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-full px-3 py-1.5 shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${role === "vip" ? "bg-amber-400" : "bg-slate-400 dark:bg-slate-500"}`} />
                    Role: {role.toUpperCase()} · ถอนขั้นต่ำ ฿{fmt(minWithdrawAmount)}
                </div>
            </div>

            {isMockMode && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {meError && <span className="block text-xs mt-1">me: {meError}</span>}
                    {payoutsError && <span className="block text-xs">payouts: {payoutsError}</span>}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-5">
                    {/* Balance hero card — Var A gradient */}
                    {meLoading && !shouldMockMe ? <BalanceSkeleton /> : (
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 text-white shadow-xl shadow-blue-500/20">
                            {/* decorative blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-400/30 blur-3xl" aria-hidden />
                            <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-blue-300/20 blur-3xl" aria-hidden />
                            <div className="relative p-7">
                                <div className="flex items-center gap-2 text-blue-200 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-[0.18em]">{w.availableBalance}</p>
                                </div>
                                <p className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none font-mono">฿{fmt(pendingBalance)}</p>
                                <p className="text-blue-200 text-sm font-medium mt-2">{w.minNote} (ขั้นต่ำ ฿{fmt(minWithdrawAmount)})</p>
                                <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200/80 uppercase tracking-wider mb-1">{w.totalEarned}</p>
                                        <p className="text-lg font-extrabold font-mono">฿{fmt(clipperData?.total_earnings ?? 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200/80 uppercase tracking-wider mb-1">{w.totalPaidOut}</p>
                                        <p className="text-lg font-extrabold font-mono">฿{fmt(clipperData?.paid_amount ?? 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasPendingRequest && (
                        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-5 py-4">
                            <Clock size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{w.pendingWarningTitle}</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{w.pendingWarningDesc}</p>
                            </div>
                        </div>
                    )}

                    {/* Withdrawal form */}
                    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                            <ArrowDownToLine size={18} className="text-slate-400 dark:text-slate-500" />
                            {w.requestWithdrawal}
                        </h2>
                        <form onSubmit={handleWithdraw} className="space-y-5">
                            {/* Quick preset amounts */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{w.quickSelect}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {PRESET_AMOUNTS.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(String(preset))}
                                            disabled={preset > pendingBalance}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                                amount === String(preset)
                                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-sm"
                                                    : preset > pendingBalance
                                                    ? "bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-white/10 cursor-not-allowed"
                                                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"
                                            }`}
                                        >
                                            ฿{fmt(preset)}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setAmount(String(Math.floor(pendingBalance)))}
                                        disabled={pendingBalance < 100}
                                        className="px-4 py-2 rounded-xl text-sm font-bold border bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {w.max}
                                    </button>
                                </div>
                            </div>

                            {/* Amount input */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{w.amountLabel}</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 dark:text-slate-500 font-mono">฿</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min={minWithdrawAmount}
                                        step={1}
                                        max={Math.floor(pendingBalance)}
                                        placeholder="0"
                                        className="w-full pl-8 pr-4 py-3.5 text-xl font-extrabold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono"
                                    />
                                </div>
                                <AnimatePresence>
                                    {validation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`flex items-center gap-2 text-xs font-semibold mt-2 ${validation.type === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                                        >
                                            {validation.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                            {validation.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bank account display */}
                            {(!meLoading || shouldMockMe) && clipperData && (
                                <div
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                                        isBankComplete
                                            ? "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                                            : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/15"
                                    }`}
                                    onClick={!isBankComplete ? openBankModal : undefined}
                                    role={!isBankComplete ? "button" : undefined}
                                >
                                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                                        isBankComplete
                                            ? "bg-white dark:bg-white/10 border-slate-200 dark:border-white/10"
                                            : "bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30"
                                    }`}>
                                        <Building2 size={18} className={isBankComplete ? "text-slate-500 dark:text-slate-400" : "text-amber-600 dark:text-amber-400"} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold ${isBankComplete ? "text-slate-700 dark:text-slate-200" : "text-amber-800 dark:text-amber-300"}`}>
                                            {clipperData.bank_type || "ยังไม่มีบัญชีธนาคาร"}
                                        </p>
                                        {isBankComplete ? (
                                            <>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium font-mono">{clipperData.bank_no}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{clipperData.bank_account_name}</p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">กดเพื่อเพิ่มบัญชีธนาคาร</p>
                                        )}
                                    </div>
                                    {isBankComplete ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shrink-0">{w.verified}</span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 shrink-0">ต้องกรอก</span>
                                    )}
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type={isBankComplete ? "submit" : "button"}
                                onClick={!isBankComplete ? openBankModal : undefined}
                                disabled={isBankComplete && (!isValidAmount || submitting || hasPendingRequest || (meLoading && !shouldMockMe))}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20"
                            >
                                <Wallet size={18} />
                                {submitting ? w.processing : !isBankComplete ? "เพิ่มบัญชีธนาคารก่อนถอนเงิน" : w.requestWithdrawal}
                            </button>

                            <AnimatePresence>
                                {submitStatus === "success" && (
                                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 rounded-xl">
                                        <CheckCircle2 size={16} /> {submitMessage ?? w.successMsg}
                                    </motion.div>
                                )}
                                {submitStatus === "error" && (
                                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-3 rounded-xl">
                                        <AlertCircle size={16} /> {submitMessage ?? "Unable to request payout"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-5">
                    {/* Withdrawal rules */}
                    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2">
                            <Info size={16} className="text-slate-400 dark:text-slate-500" /> {w.rulesTitle}
                        </h3>
                        <ul className="space-y-2.5">
                            {w.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payout history */}
                    <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{w.history}</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-white/8">
                            {payoutsLoading && !shouldMockPayouts ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20" />
                                            <div className="h-3 bg-slate-100 dark:bg-white/8 rounded w-16" />
                                        </div>
                                        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-16" />
                                    </div>
                                ))
                            ) : filteredPayouts.length === 0 ? (
                                <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-8">
                                    {searchQuery ? `No payouts match "${searchQuery}"` : w.noPayouts}
                                </p>
                            ) : (
                                filteredPayouts.map((payout: PayoutResponse) => {
                                    const { badge, icon } = getPayoutStatusStyle(payout.status);
                                    return (
                                        <div key={payout.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 font-mono">฿{fmt(payout.amount)}</p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{fmtDate(payout.created_at)}</p>
                                                {payout.reason && <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-0.5">{payout.reason}</p>}
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

        {/* Bank account modal */}
        <AnimatePresence>
            {showBankModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowBankModal(false); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/8">
                            <div className="flex items-center gap-2">
                                <Building2 size={18} className="text-blue-500" />
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">เพิ่มบัญชีธนาคาร</h3>
                            </div>
                            <button
                                onClick={() => setShowBankModal(false)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-slate-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">กรอกข้อมูลบัญชีธนาคารเพื่อรับเงินค่าถอน</p>
                            <form onSubmit={handleSaveBankModal} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">ชื่อธนาคาร</label>
                                    <select
                                        value={modalBankType}
                                        onChange={(e) => setModalBankType(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        {BANK_OPTIONS.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">ชื่อบัญชี</label>
                                    <input
                                        type="text"
                                        value={modalBankName}
                                        onChange={(e) => setModalBankName(e.target.value)}
                                        placeholder="ชื่อ-นามสกุลตามบัญชีธนาคาร"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">เลขที่บัญชี</label>
                                    <input
                                        type="text"
                                        value={modalBankNo}
                                        onChange={(e) => setModalBankNo(e.target.value)}
                                        placeholder="xxx-x-xxxxx-x"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>

                                <AnimatePresence>
                                    {modalSaveStatus === "saved" && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 rounded-xl">
                                            <CheckCircle2 size={15} /> {modalSaveMessage}
                                        </motion.div>
                                    )}
                                    {modalSaveStatus === "error" && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-3 rounded-xl">
                                            <AlertCircle size={15} /> {modalSaveMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={modalSaveStatus === "saving" || modalSaveStatus === "saved"}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-bold text-sm py-3 rounded-xl transition-opacity disabled:opacity-60"
                                    >
                                        <Save size={15} />
                                        {modalSaveStatus === "saving" ? "กำลังบันทึก..." : "บันทึก"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowBankModal(false)}
                                        className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-sm px-5 py-3 rounded-xl transition-colors"
                                    >
                                        <X size={15} /> ยกเลิก
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
