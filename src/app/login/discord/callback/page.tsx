"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { DISCORD_OAUTH_STATE_KEY } from "@/app/login/DiscordLoginButton";

type CallbackStatus = "loading" | "error";

function readDiscordHash() {
    const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;

    return new URLSearchParams(hash);
}

export default function DiscordCallbackPage() {
    const [status, setStatus] = useState<CallbackStatus>("loading");
    const [message, setMessage] = useState("Signing you in with Discord...");

    useEffect(() => {
        async function completeLogin() {
            const params = readDiscordHash();
            const accessToken = params.get("access_token");
            const state = params.get("state");
            const expectedState = window.sessionStorage.getItem(DISCORD_OAUTH_STATE_KEY);

            if (!accessToken) {
                setStatus("error");
                setMessage("Discord did not return an access token.");
                return;
            }

            if (!state || !expectedState || state !== expectedState) {
                setStatus("error");
                setMessage("Discord login state validation failed. Please try again.");
                return;
            }

            window.sessionStorage.removeItem(DISCORD_OAUTH_STATE_KEY);

            try {
                const res = await fetch("/api/auth/discord/session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ accessToken }),
                });

                const body = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(body?.error ?? "Discord session setup failed.");
                }

                window.location.replace("/app/overview");
            } catch (error) {
                setStatus("error");
                setMessage(error instanceof Error ? error.message : "Discord session setup failed.");
            }
        }

        completeLogin();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 text-zinc-100">
            <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                {status === "loading" ? (
                    <>
                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#5865F2]" />
                        <h1 className="text-2xl font-bold mb-2">Connecting Discord</h1>
                        <p className="text-zinc-400 text-sm">{message}</p>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-10 h-10 mx-auto mb-4 text-rose-400" />
                        <h1 className="text-2xl font-bold mb-2">Discord Login Failed</h1>
                        <p className="text-zinc-400 text-sm">{message}</p>
                        <a
                            href="/login"
                            className="inline-flex mt-6 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors"
                        >
                            Back to Login
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}