import { NextResponse } from "next/server";
import { fetchClipperById } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const clipper = await fetchClipperById(user.discord_id);
        if (!clipper) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }
        return NextResponse.json(clipper);
    } catch (err) {
        console.error("[/api/portal/me]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
