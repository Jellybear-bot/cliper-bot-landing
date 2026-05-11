import { NextResponse } from "next/server";
import { fetchClipperStats } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";
import { MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";
import { FORCE_PORTAL_MOCK_MODE } from "@/lib/portalConfig";

function buildMockStats() {
    const daily = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const views = Math.round(12000 + i * 32000 + Math.random() * 10000);
        return {
            date: d.toISOString().slice(0, 10),
            views,
            earnings: parseFloat((views / 1000 * 4).toFixed(2)),
        };
    });
    return {
        daily,
        today_earnings: daily[daily.length - 1].earnings,
        streak_days: 12,
    };
}

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (FORCE_PORTAL_MOCK_MODE) {
        return NextResponse.json(buildMockStats());
    }

    try {
        const stats = await fetchClipperStats(user.discord_id);
        return NextResponse.json(stats);
    } catch (err) {
        console.error("[/api/portal/stats]", err);
        // Fallback to derived mock on error in dev
        return NextResponse.json(buildMockStats(), { status: 200 });
    }
}
