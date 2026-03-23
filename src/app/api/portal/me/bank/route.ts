import { NextResponse } from "next/server";
import { fetchClipperById, updateClipperBank, updateClipperBankWithDiscordToken } from "@/lib/backend";
import { getDiscordAccessToken, getSessionUser } from "@/lib/session";

export async function PATCH(request: Request) {
    const user = getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json().catch(() => null) as {
            bankNo?: string;
            bankType?: string;
        } | null;

        const bankNo = body?.bankNo?.trim();
        const bankType = body?.bankType?.trim();

        if (!bankNo || !bankType) {
            return NextResponse.json({ error: "bankNo and bankType are required" }, { status: 400 });
        }

        const compactBankNo = bankNo.replace(/[\s-]/g, "");
        if (!/^\d{8,20}$/.test(compactBankNo)) {
            return NextResponse.json({ error: "bankNo must contain 8-20 digits" }, { status: 400 });
        }

        const clipper = await fetchClipperById(user.discord_id);
        if (!clipper) {
            return NextResponse.json({ error: "clipper not found" }, { status: 404 });
        }

        const accessToken = getDiscordAccessToken();
        let result = accessToken
            ? await updateClipperBankWithDiscordToken({
                accessToken,
                bank_no: bankNo,
                bank_type: bankType,
            })
            : await updateClipperBank({
                discord_id: user.discord_id,
                bank_no: bankNo,
                bank_type: bankType,
            });

        if (accessToken && !result.ok && result.status === 404) {
            const fallback = await updateClipperBank({
                discord_id: user.discord_id,
                bank_no: bankNo,
                bank_type: bankType,
            });

            if (fallback.configured) {
                result = fallback;
            }
        }

        if (!result.ok) {
            const missingBackendRoute = accessToken && result.status === 404 && !result.configured;
            const missingAuthBridge = !accessToken && !result.configured;
            return NextResponse.json(
                {
                    error: missingBackendRoute
                        ? "The backend currently pointed to by BACKEND_URL does not expose POST /backend/api/v1/add_bank_account, and no fallback bank-update proxy is configured."
                        : missingAuthBridge
                        ? "Frontend bank update flow is ready, but this session is missing Discord login and no fallback bank-update proxy is configured."
                        : result.error ?? "bank update failed",
                    configured: result.configured,
                },
                { status: result.status || 500 },
            );
        }

        return NextResponse.json({
            ok: true,
            bank: result.data,
            configured: true,
        });
    } catch (err) {
        console.error("[/api/portal/me/bank][PATCH]", err);
        return NextResponse.json({ error: "backend unavailable" }, { status: 503 });
    }
}
