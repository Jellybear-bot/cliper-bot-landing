import { mockLogin } from "@/modules/app-portal/services/auth/actions";
import { LogIn } from "lucide-react";

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

                    <form action={mockLogin} className="relative z-10">
                        <button
                            type="submit"
                            className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#5865F2]/20"
                        >
                            <LogIn size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                            <span>Developer Sign In</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-zinc-500 font-medium relative z-10">
                        <p>This signs in with the local development session flow.</p>
                        <p className="mt-1">Real Discord OAuth still needs backend/auth provider integration.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
