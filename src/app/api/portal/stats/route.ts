import { NextResponse } from "next/server";
import { fetchClipperStats, findOrCreateClipperWithDiscordToken } from "@/lib/backend";
import { getDiscordAccessToken, getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        let discordId = user.discord_id;

        const accessToken = getDiscordAccessToken();
        if (accessToken) {
            const clipper = await findOrCreateClipperWithDiscordToken(accessToken).catch(() => null);
            if (clipper?.discord_id) discordId = clipper.discord_id;
        }

        console.log("[/api/portal/stats] querying clipper_id:", discordId);
        const stats = await fetchClipperStats(discordId);
        console.log("[/api/portal/stats] result:", JSON.stringify(stats).slice(0, 200));
        return NextResponse.json(stats);
    } catch (err) {
        console.error("[/api/portal/stats]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
