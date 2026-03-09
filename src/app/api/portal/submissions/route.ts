import { NextResponse } from "next/server";
import { createSubmission, fetchCampaigns, fetchClipperById, fetchSubmissionsByClipper } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";
import { getRoleFromClipper, isVipCampaign } from "@/modules/app-portal/roleConfig";

export async function GET() {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const submissions = await fetchSubmissionsByClipper(user.discord_id);
        return NextResponse.json(submissions);
    } catch (err) {
        console.error("[/api/portal/submissions]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}

export async function POST(request: Request) {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => null) as {
            campaignId?: string;
            campaignName?: string;
            videoUrl?: string;
        } | null;

        const campaignId = body?.campaignId?.trim();
        const campaignName = body?.campaignName?.trim();
        const videoUrl = body?.videoUrl?.trim();

        if (!campaignId || !campaignName || !videoUrl) {
            return NextResponse.json({ error: "campaignId, campaignName, and videoUrl are required" }, { status: 400 });
        }

        try {
            new URL(videoUrl);
        } catch {
            return NextResponse.json({ error: "videoUrl must be a valid URL" }, { status: 400 });
        }

        const [clipper, campaigns] = await Promise.all([
            fetchClipperById(user.discord_id),
            fetchCampaigns(),
        ]);

        if (!clipper) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }

        const campaign = campaigns.find((item) => item.id === campaignId || item.campaign_name === campaignName);
        if (!campaign) {
            return NextResponse.json({ error: "campaign not found" }, { status: 404 });
        }

        if (!campaign.status.includes("🟢")) {
            return NextResponse.json({ error: "campaign is not active" }, { status: 409 });
        }

        if (isVipCampaign(campaign) && getRoleFromClipper(clipper) !== "vip") {
            return NextResponse.json({ error: "vip access required for this campaign" }, { status: 403 });
        }

        const result = await createSubmission({
            discord_id: user.discord_id,
            campaign_id: campaign.id,
            campaign_name: campaign.campaign_name,
            video_url: videoUrl,
        });

        if (!result.ok) {
            return NextResponse.json(
                {
                    error: result.error ?? "submission failed",
                    configured: result.configured,
                },
                { status: result.status || 500 },
            );
        }

        return NextResponse.json({
            ok: true,
            submission: result.data,
            configured: true,
        });
    } catch (err) {
        console.error("[/api/portal/submissions][POST]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
