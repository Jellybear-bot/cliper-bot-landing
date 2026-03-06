import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/app" || pathname === "/app/") {
        const target = request.cookies.get("mock_session")?.value
            ? "/app/overview"
            : "/login";

        return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app", "/app/"],
};
