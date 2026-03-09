import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LEGACY_PORTAL_SESSION_COOKIE, PORTAL_SESSION_COOKIE } from "@/lib/auth-constants";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/app" || pathname === "/app/") {
        const target = request.cookies.get(PORTAL_SESSION_COOKIE)?.value || request.cookies.get(LEGACY_PORTAL_SESSION_COOKIE)?.value
            ? "/app/campaigns"
            : "/login";

        return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app", "/app/"],
};
