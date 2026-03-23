"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    LEGACY_PORTAL_SESSION_COOKIE,
    PORTAL_DISCORD_TOKEN_COOKIE,
    PORTAL_SESSION_COOKIE,
} from "@/lib/auth-constants";

export async function mockLogout() {
    cookies().delete(PORTAL_SESSION_COOKIE);
    cookies().delete(LEGACY_PORTAL_SESSION_COOKIE);
    cookies().delete(PORTAL_DISCORD_TOKEN_COOKIE);
    redirect("/");
}
