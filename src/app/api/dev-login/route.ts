import { NextResponse } from "next/server";
import { LEGACY_PORTAL_SESSION_COOKIE } from "@/lib/auth-constants";

export function GET(request: Request) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    const session = JSON.stringify({ discord_id: "dev-user-001", username: "Dev Clipper" });

    const res = NextResponse.redirect(new URL("/app/overview", request.url));
    res.cookies.set(LEGACY_PORTAL_SESSION_COOKIE, session, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
    });

    return res;
}
