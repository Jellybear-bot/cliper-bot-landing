"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function mockLogin() {
    // Set a dummy cookie to simulate a session
    cookies().set({
        name: "mock_session",
        value: "authenticated_discord_user",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Redirect to the protected portal
    redirect("/app");
}

export async function mockLogout() {
    // Delete the session cookie
    cookies().delete("mock_session");

    // Redirect back to landing page
    redirect("/");
}
