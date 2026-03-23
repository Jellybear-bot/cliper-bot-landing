import { NextResponse } from "next/server";
import { enrichClipperProfile, fetchClipperById, fetchPayoutsByClipper, fetchSubmissionsByClipper } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const [clipper, payouts, submissions] = await Promise.all([
            fetchClipperById(user.discord_id),
            fetchPayoutsByClipper(user.discord_id).catch(() => []),
            fetchSubmissionsByClipper(user.discord_id).catch(() => []),
        ]);

        const profile = enrichClipperProfile(clipper, payouts, submissions);
        if (!profile) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }
        return NextResponse.json(profile);
    } catch (err) {
        console.error("[/api/portal/me]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
