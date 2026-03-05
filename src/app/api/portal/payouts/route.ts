import { NextResponse } from "next/server";
import { fetchPayoutsByClipper } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const payouts = await fetchPayoutsByClipper(user.discord_id);
        return NextResponse.json(payouts);
    } catch (err) {
        console.error("[/api/portal/payouts]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
