import { NextResponse } from "next/server";
import { submitBrandInquiry } from "@/lib/backend";

const REQUIRED_FIELDS = [
    "firstName",
    "lastName",
    "companyName",
    "email",
    "goal",
    "budget",
    "timeline",
] as const;

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null) as {
            firstName?: string;
            lastName?: string;
            companyName?: string;
            brandName?: string;
            email?: string;
            phone?: string;
            goal?: string;
            budget?: string;
            timeline?: string;
            details?: string;
        } | null;

        if (!body) {
            return NextResponse.json({ error: "invalid request body" }, { status: 400 });
        }

        for (const field of REQUIRED_FIELDS) {
            if (!body[field]?.trim()) {
                return NextResponse.json({ error: `${field} is required` }, { status: 400 });
            }
        }

        const email = body.email?.trim() ?? "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "email must be valid" }, { status: 400 });
        }

        const result = await submitBrandInquiry({
            firstName: body.firstName?.trim() ?? "",
            lastName: body.lastName?.trim() ?? "",
            companyName: body.companyName?.trim() ?? "",
            brandName: body.brandName?.trim() ?? "",
            email,
            phone: body.phone?.trim() ?? "",
            goal: body.goal?.trim() ?? "",
            budget: body.budget?.trim() ?? "",
            timeline: body.timeline?.trim() ?? "",
            details: body.details?.trim() ?? "",
        });

        if (!result.ok) {
            return NextResponse.json(
                {
                    error: result.error ?? "brand inquiry delivery is not configured yet",
                    configured: result.configured,
                },
                { status: result.status || 500 },
            );
        }

        return NextResponse.json({
            ok: true,
            configured: true,
        });
    } catch (err) {
        console.error("[/api/brand-inquiry][POST]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
