import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    LEGACY_PORTAL_SESSION_COOKIE,
    PORTAL_DISCORD_TOKEN_COOKIE,
    PORTAL_SESSION_COOKIE,
} from "@/lib/auth-constants";
import { createDiscordAccessTokenCookie, createSessionToken, type SessionUser } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null) as { accessToken?: string } | null;
        const accessToken = body?.accessToken?.trim();

        if (!accessToken) {
            return NextResponse.json({ error: "accessToken is required" }, { status: 400 });
        }

        const discordRes = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        const discordBody = await discordRes.json().catch(() => null) as {
            id?: string;
            username?: string;
            global_name?: string | null;
            message?: string;
        } | null;

        if (!discordRes.ok || !discordBody?.id || !discordBody?.username) {
            return NextResponse.json(
                { error: discordBody?.message ?? "Unable to fetch Discord profile" },
                { status: discordRes.status || 401 },
            );
        }

        const user: SessionUser = {
            discord_id: discordBody.id,
            username: discordBody.global_name?.trim() || discordBody.username,
        };

        cookies().set({
            name: PORTAL_SESSION_COOKIE,
            value: createSessionToken(user),
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
        });
        cookies().set({
            name: PORTAL_DISCORD_TOKEN_COOKIE,
            value: createDiscordAccessTokenCookie(accessToken),
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
        });
        cookies().delete(LEGACY_PORTAL_SESSION_COOKIE);

        return NextResponse.json({ ok: true, user });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Discord session setup failed" },
            { status: 500 },
        );
    }
}
