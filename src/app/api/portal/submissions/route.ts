import { NextResponse } from "next/server";
import { fetchSubmissionsByClipper } from "@/lib/backend";
import { getSessionUser } from "@/lib/session";

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
