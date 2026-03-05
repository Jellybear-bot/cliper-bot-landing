/**
 * Server-side API client for bot-discord-boss backend.
 * Used only in Next.js route handlers (server-side) — never import in client components.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const API_KEY = process.env.DASHBOARD_API_KEY ?? "";

const authHeaders = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
};

// ─── Clipper ──────────────────────────────────────────────────────────────────

export interface ClipperResponse {
    discord_id: string;
    username: string;
    payment_info: string;
    bank_no: string;
    bank_type: string;
    pending_balance: number;
    paid_amount: number;
    total_earnings: number;
    total_views: number;
    status: string;
    created_at: string;
}

export async function fetchClippers(): Promise<ClipperResponse[]> {
    const res = await fetch(`${BACKEND_URL}/api/clippers`, {
        headers: authHeaders,
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`fetchClippers: ${res.status}`);
    return res.json();
}

export async function fetchClipperById(discordId: string): Promise<ClipperResponse | null> {
    const all = await fetchClippers();
    return all.find((c) => c.discord_id === discordId) ?? null;
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export interface CampaignResponse {
    id: string;
    campaign_name: string;
    client_name: string;
    total_budget: number;
    view_target: number;
    cost_per_thousand_views: number;
    campaign_material_link: string;
    status: string;
    total_views_generated: number;
    budget_spent: number;
    created_at: string;
}

export async function fetchCampaigns(): Promise<CampaignResponse[]> {
    const res = await fetch(`${BACKEND_URL}/api/campaigns`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`fetchCampaigns: ${res.status}`);
    return res.json();
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export interface SubmissionResponse {
    id: string;
    clipper_id: string;
    campaign_name: string;
    video_url: string;
    status: string;
    play_count: number;
    like_count: number;
    comments_count: number;
    share_count: number;
    calculated_payout: number;
    last_calculated_views: number;
    created_at: string;
}

export async function fetchSubmissions(): Promise<SubmissionResponse[]> {
    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
        headers: authHeaders,
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`fetchSubmissions: ${res.status}`);
    return res.json();
}

export async function fetchSubmissionsByClipper(discordId: string): Promise<SubmissionResponse[]> {
    const all = await fetchSubmissions();
    return all.filter((s) => s.clipper_id === discordId);
}

// ─── Payouts ─────────────────────────────────────────────────────────────────

export interface PayoutResponse {
    id: number;
    clipper_id: string;
    clipper_username: string;
    amount: number;
    status: string;
    reason: string;
    bank_no: string;
    bank_type: string;
    created_at: string;
}

export async function fetchPayoutsByClipper(discordId: string): Promise<PayoutResponse[]> {
    // This endpoint is public when clipper_id is provided
    const res = await fetch(`${BACKEND_URL}/api/payouts?clipper_id=${discordId}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`fetchPayoutsByClipper: ${res.status}`);
    return res.json();
}
