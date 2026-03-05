"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Link as LinkIcon, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export function LinkSubmissionForm() {
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [focused, setFocused] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsSubmitting(true);
        setStatus("idle");

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (url.includes("error")) {
            setStatus("error");
        } else {
            setStatus("success");
            setUrl("");
            setTimeout(() => setStatus("idle"), 3000);
        }
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full relative group"
        >
            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm overflow-hidden">
                {/* Decorative glassy gradients inside */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-50/50 blur-[80px] rounded-full pointer-events-none" />

                <div className="mb-10 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                        <Sparkles size={14} className="text-blue-500" />
                        <span>New Campaign</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Drop your link here.
                    </h2>
                    <p className="text-slate-500 text-base font-medium">
                        Paste your TikTok, YouTube, or Instagram URL to launch a new campaign.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10 w-full max-w-2xl mx-auto">
                    <motion.div
                        animate={focused ? { scale: 1.02 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative"
                    >
                        <div className={`absolute -inset-1 rounded-3xl blur-lg transition-all duration-500 ${focused ? 'bg-gradient-to-r from-violet-400/40 via-rose-400/40 to-amber-400/40 opacity-100' : 'opacity-0'}`} />

                        <div className="relative group/input bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex items-stretch">
                            <div className="pl-5 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within/input:text-violet-500 transition-colors bg-white">
                                <LinkIcon size={20} />
                            </div>
                            <input
                                id="link-url"
                                type="url"
                                required
                                value={url}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://tiktok.com/@creator/video/123..."
                                className="w-full bg-transparent py-5 pl-4 pr-6 text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-medium text-lg"
                            />
                        </div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                        <AnimatePresence mode="wait">
                            {status === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="flex items-center text-emerald-700 text-sm font-bold gap-3 bg-emerald-100 px-5 py-3 rounded-2xl border border-emerald-200 shadow-sm w-full sm:w-auto"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white shrink-0">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span>Woohoo! Link submitted successfully.</span>
                                </motion.div>
                            )}
                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="flex items-center text-rose-700 text-sm font-bold gap-3 bg-rose-100 px-5 py-3 rounded-2xl border border-rose-200 shadow-sm w-full sm:w-auto"
                                >
                                    <div className="w-8 h-8 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 flex items-center justify-center text-white shrink-0">
                                        <AlertCircle size={18} />
                                    </div>
                                    <span>Oops! Something went wrong.</span>
                                </motion.div>
                            )}
                            {status === "idle" && <div className="hidden sm:block" />}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting || !url}
                            whileHover={!isSubmitting && url ? { scale: 1.05 } : {}}
                            whileTap={!isSubmitting && url ? { scale: 0.95 } : {}}
                            className="ml-auto w-full sm:w-auto relative overflow-hidden group flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 text-white font-bold px-10 py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)]"
                        >
                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                {isSubmitting ? "Sending..." : "Launch Campaign"}
                                {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </span>
                            {/* Hover shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 translate-x-[-100%] group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                        </motion.button>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                @keyframes shine {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </motion.div>
    );
}
