import { NextResponse } from "next/server";
import { fetchClipperStats } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const stats = await fetchClipperStats(user.discord_id);
        return NextResponse.json(stats);
    } catch (err) {
        console.error("[/api/portal/stats]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
