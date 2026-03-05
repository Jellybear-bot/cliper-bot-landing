import { NextResponse } from "next/server";
import { fetchCampaigns } from "@/lib/backend";

export async function GET() {
    try {
        const campaigns = await fetchCampaigns();
        return NextResponse.json(campaigns);
    } catch (err) {
        console.error("[/api/portal/campaigns]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
