"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LEGACY_PORTAL_SESSION_COOKIE, PORTAL_SESSION_COOKIE } from "@/lib/auth-constants";
import { createSessionToken, type SessionUser } from "@/lib/session";

export type { SessionUser };

export async function mockLogin() {
    const user: SessionUser = {
        discord_id: process.env.MOCK_DISCORD_ID ?? "765432198765432100",
        username: process.env.MOCK_USERNAME ?? "Test Creator",
    };

    cookies().set({
        name: PORTAL_SESSION_COOKIE,
        value: createSessionToken(user),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    cookies().delete(LEGACY_PORTAL_SESSION_COOKIE);

    redirect("/app/overview");
}

export async function mockLogout() {
    cookies().delete(PORTAL_SESSION_COOKIE);
    cookies().delete(LEGACY_PORTAL_SESSION_COOKIE);
    redirect("/");
}
