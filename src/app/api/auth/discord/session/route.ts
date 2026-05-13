import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    LEGACY_PORTAL_SESSION_COOKIE,
    PORTAL_DISCORD_TOKEN_COOKIE,
    PORTAL_SESSION_COOKIE,
} from "@/lib/auth-constants";
import { createDiscordAccessTokenCookie, createSessionToken, type SessionUser } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null) as { accessToken?: string } | null;
        const accessToken = body?.accessToken?.trim();

        if (!accessToken) {
            return NextResponse.json({ error: "accessToken is required" }, { status: 400 });
        }

        // Verify via backend — this checks the clipper role AND auto-registers the user
        const clipperRes = await fetch(`${BACKEND_URL}/api/clipper/auth`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        const clipperBody = await clipperRes.json().catch(() => null) as {
            data?: { discord_id?: string; username?: string };
            message_th?: string;
            message?: string;
        } | null;

        if (!clipperRes.ok) {
            const errMsg = clipperBody?.message_th ?? clipperBody?.message ?? "You do not have the required Clipper role.";
            return NextResponse.json({ error: errMsg }, { status: clipperRes.status });
        }

        if (!clipperBody?.data?.discord_id || !clipperBody?.data?.username) {
            return NextResponse.json({ error: "Unable to fetch clipper profile" }, { status: 401 });
        }

        const user: SessionUser = {
            discord_id: clipperBody.data.discord_id,
            username: clipperBody.data.username,
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
