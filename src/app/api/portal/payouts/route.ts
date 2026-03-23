import { NextResponse } from "next/server";
import { createPayoutRequestWithDiscordToken, enrichClipperProfile, fetchClipperById, fetchPayoutsByClipper, fetchSubmissionsByClipper } from "@/lib/backend";
import { getDiscordAccessToken, getSessionUser } from "@/lib/session";
import { getRoleFromClipper, ROLE_PERMISSIONS } from "@/modules/app-portal/roleConfig";

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

export async function POST(request: Request) {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => null) as { amount?: number } | null;
        const amount = Number(body?.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
        }

        const [rawClipper, payouts, submissions] = await Promise.all([
            fetchClipperById(user.discord_id),
            fetchPayoutsByClipper(user.discord_id),
            fetchSubmissionsByClipper(user.discord_id).catch(() => []),
        ]);

        const clipper = enrichClipperProfile(rawClipper, payouts, submissions);

        if (!clipper) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }

        const role = getRoleFromClipper(clipper);
        const permissions = ROLE_PERMISSIONS[role];

        if (!clipper.bank_no || !clipper.bank_type) {
            return NextResponse.json({ error: "bank account is required before requesting a payout" }, { status: 409 });
        }

        if (amount < permissions.minWithdrawAmount) {
            return NextResponse.json({ error: `minimum withdraw amount is ${permissions.minWithdrawAmount}` }, { status: 400 });
        }

        if (amount % 100 !== 0) {
            return NextResponse.json({ error: "amount must be a multiple of 100" }, { status: 400 });
        }

        if (amount > clipper.pending_balance) {
            return NextResponse.json({ error: "insufficient pending balance" }, { status: 400 });
        }

        if (payouts.some((payout) => payout.status.includes("⏳"))) {
            return NextResponse.json({ error: "there is already a pending payout request" }, { status: 409 });
        }

        const accessToken = getDiscordAccessToken();
        if (!accessToken) {
            return NextResponse.json(
                {
                    error: "Discord login is required because payout requests are sent to /backend/api/v1/withdraws.",
                    configured: true,
                },
                { status: 401 },
            );
        }

        const result = await createPayoutRequestWithDiscordToken({
            accessToken,
            amount,
        });

        if (!result.ok) {
            const missingBackendRoute = result.status === 404;
            return NextResponse.json(
                {
                    error: missingBackendRoute
                        ? "The backend currently pointed to by BACKEND_URL does not expose POST /backend/api/v1/withdraws."
                        : result.error ?? "payout request failed",
                    configured: result.configured,
                },
                { status: result.status || 500 },
            );
        }

        return NextResponse.json({
            ok: true,
            payout: result.data,
            configured: true,
        });
    } catch (err) {
        console.error("[/api/portal/payouts][POST]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
