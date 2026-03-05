"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/lib/session";

export type { SessionUser };

export async function mockLogin() {
    const user: SessionUser = {
        discord_id: process.env.MOCK_DISCORD_ID ?? "765432198765432100",
        username: process.env.MOCK_USERNAME ?? "Test Creator",
    };

    cookies().set({
        name: "mock_session",
        value: JSON.stringify(user),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    redirect("/app");
}

export async function mockLogout() {
    cookies().delete("mock_session");
    redirect("/");
}
