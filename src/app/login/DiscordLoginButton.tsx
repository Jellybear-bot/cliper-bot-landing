"use client";

import { LogIn } from "lucide-react";

const DISCORD_OAUTH_STATE_KEY = "discord_oauth_state";

function buildDiscordAuthorizeUrl() {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    if (!clientId) return null;

    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
        || `${window.location.origin}/login/discord/callback`;
    const state = crypto.randomUUID();

    window.sessionStorage.setItem(DISCORD_OAUTH_STATE_KEY, state);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "token",
        redirect_uri: redirectUri,
        scope: "identify",
        prompt: "consent",
        state,
    });

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export function DiscordLoginButton() {
    const isConfigured = Boolean(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);

    function handleClick() {
        const url = buildDiscordAuthorizeUrl();
        if (!url) return;
        window.location.assign(url);
    }

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleClick}
                disabled={!isConfigured}
                className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#5865F2]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <LogIn size={20} className="group-hover/btn:-translate-y-1 transition-transform" />
                <span>Continue with Discord</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
            </button>

            {!isConfigured && (
                <p className="text-xs text-amber-300 text-center">
                    Discord OAuth is not configured yet. Set NEXT_PUBLIC_DISCORD_CLIENT_ID first.
                </p>
            )}
        </div>
    );
}

export { DISCORD_OAUTH_STATE_KEY };