import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
    LEGACY_PORTAL_SESSION_COOKIE,
    PORTAL_DISCORD_TOKEN_COOKIE,
    PORTAL_SESSION_COOKIE,
} from "@/lib/auth-constants";

export interface SessionUser {
    discord_id: string;
    username: string;
}

interface SignedCookiePayload {
    v: string;
}

function getSessionSecret() {
    const secret = process.env.PORTAL_SESSION_SECRET ?? process.env.SESSION_SECRET;

    if (secret) return secret;
    if (process.env.NODE_ENV !== "production") return "crowdclip-dev-session-secret";

    throw new Error("PORTAL_SESSION_SECRET is required in production.");
}

function signSessionPayload(payload: string) {
    return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function safeCompare(a: string, b: string) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);

    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

function parseSessionPayload(raw: string) {
    try {
        return JSON.parse(raw) as SessionUser;
    } catch {
        return null;
    }
}

function decodeSignedSession(token: string) {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = signSessionPayload(payload);
    if (!safeCompare(signature, expected)) return null;

    try {
        const raw = Buffer.from(payload, "base64url").toString("utf8");
        return parseSessionPayload(raw);
    } catch {
        return null;
    }
}

function decodeLegacySession(token: string) {
    if (process.env.NODE_ENV === "production") return null;
    return parseSessionPayload(token);
}

function createSignedCookieValue(value: string) {
    const payload = Buffer.from(JSON.stringify({ v: value } satisfies SignedCookiePayload), "utf8").toString("base64url");
    const signature = signSessionPayload(payload);
    return `${payload}.${signature}`;
}

function decodeSignedCookieValue(token: string) {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = signSessionPayload(payload);
    if (!safeCompare(signature, expected)) return null;

    try {
        const raw = Buffer.from(payload, "base64url").toString("utf8");
        const parsed = JSON.parse(raw) as SignedCookiePayload;
        return typeof parsed.v === "string" ? parsed.v : null;
    } catch {
        return null;
    }
}

export function createSessionToken(user: SessionUser) {
    const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
    const signature = signSessionPayload(payload);
    return `${payload}.${signature}`;
}

export function createDiscordAccessTokenCookie(accessToken: string) {
    return createSignedCookieValue(accessToken);
}

export function getSessionUser(): SessionUser | null {
    try {
        const cookieStore = cookies();
        const signed = cookieStore.get(PORTAL_SESSION_COOKIE);
        if (signed?.value) {
            return decodeSignedSession(signed.value);
        }

        const legacy = cookieStore.get(LEGACY_PORTAL_SESSION_COOKIE);
        if (legacy?.value) {
            return decodeLegacySession(legacy.value);
        }

        return null;
    } catch {
        return null;
    }
}

export function getDiscordAccessToken(): string | null {
    try {
        const cookieStore = cookies();
        const signed = cookieStore.get(PORTAL_DISCORD_TOKEN_COOKIE);
        if (!signed?.value) return null;

        return decodeSignedCookieValue(signed.value);
    } catch {
        return null;
    }
}
