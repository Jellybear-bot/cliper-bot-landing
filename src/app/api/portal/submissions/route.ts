import { NextResponse } from "next/server";
import { createSubmission, createSubmissionWithDiscordToken, fetchCampaigns, fetchClipperById, fetchSubmissionsByClipper } from "@/lib/backend";
import { getDiscordAccessToken, getSessionUser } from "@/lib/session";
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

        const accessToken = getDiscordAccessToken();
        let result = accessToken
            ? await createSubmissionWithDiscordToken({
                accessToken,
                campaign_id: campaign.id,
                video_url: videoUrl,
            })
            : await createSubmission({
                discord_id: user.discord_id,
                campaign_id: campaign.id,
                campaign_name: campaign.campaign_name,
                video_url: videoUrl,
            });

        if (accessToken && !result.ok && result.status === 404) {
            const fallback = await createSubmission({
                discord_id: user.discord_id,
                campaign_id: campaign.id,
                campaign_name: campaign.campaign_name,
                video_url: videoUrl,
            });

            if (fallback.configured) {
                result = fallback;
            }
        }

        if (!result.ok) {
            const missingAuthBridge = !accessToken && !result.configured;
            const missingBackendRoute = accessToken && result.status === 404 && !result.configured;
            return NextResponse.json(
                {
                    error: missingBackendRoute
                        ? "The backend currently pointed to by BACKEND_URL does not expose POST /backend/api/v1/campaigns/join, and no fallback submission proxy is configured."
                        : missingAuthBridge
                        ? "Frontend is ready, but the latest backend submission route requires Discord login and no frontend auth bridge is available for this session yet."
                        : result.error ?? "submission failed",
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
