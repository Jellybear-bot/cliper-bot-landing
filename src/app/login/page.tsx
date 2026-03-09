import { mockLogin } from "@/modules/app-portal/services/auth/actions";
import { LogIn, ShieldCheck } from "lucide-react";
import { DiscordLoginButton } from "@/app/login/DiscordLoginButton";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden text-zinc-100">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute -inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="text-center mb-10 relative z-10">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 group-hover:scale-110 transition-transform duration-500 font-bold text-2xl tracking-tighter">
                            CC
                        </div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-zinc-400 text-sm">Sign in to access your Creator Portal.</p>
                    </div>

                    <div className="relative z-10 space-y-3">
                        <DiscordLoginButton />

                        <form action={mockLogin}>
                            <button
                                type="submit"
                                className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-zinc-100 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border border-white/10"
                            >
                                <ShieldCheck size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                                <span>Bypass Sign In</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-xs text-zinc-500 font-medium relative z-10 space-y-1">
                        <p>Choose one of two sign-in methods.</p>
                        <p>Discord login creates a real portal session from your Discord account.</p>
                        <p>Bypass login creates a local development session immediately.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
