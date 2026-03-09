import { NextResponse } from "next/server";
import { fetchClipperById, fetchPayoutsByClipper, mergeClipperWithPayoutHistory } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const [clipper, payouts] = await Promise.all([
            fetchClipperById(user.discord_id),
            fetchPayoutsByClipper(user.discord_id).catch(() => []),
        ]);

        const profile = mergeClipperWithPayoutHistory(clipper, payouts);
        if (!profile) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }
        return NextResponse.json(profile);
    } catch (err) {
        console.error("[/api/portal/me]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
