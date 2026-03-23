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

async function buildFetchError(label: string, res: Response) {
    const body = await res.json().catch(() => null) as { error?: string; message?: string } | null;
    const message = body?.error ?? body?.message ?? `${label}: ${res.status}`;
    return new Error(message);
}

export interface BackendMutationResult<T = unknown> {
    configured: boolean;
    ok: boolean;
    status: number;
    data: T | null;
    error: string | null;
}

async function proxyConfiguredMutation<T>(
    url: string | undefined,
    method: "POST" | "PATCH" | "PUT",
    body: unknown,
    useAuth = true,
): Promise<BackendMutationResult<T>> {
    if (!url) {
        return {
            configured: false,
            ok: false,
            status: 501,
            data: null,
            error: "Frontend route is ready, but the backend write endpoint is not configured yet.",
        };
    }

    try {
        const res = await fetch(url, {
            method,
            headers: useAuth ? authHeaders : { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        return {
            configured: true,
            ok: res.ok,
            status: res.status,
            data,
            error: res.ok ? null : (data as { error?: string } | null)?.error ?? `Request failed with HTTP ${res.status}`,
        };
    } catch (error) {
        return {
            configured: true,
            ok: false,
            status: 503,
            data: null,
            error: error instanceof Error ? error.message : "Backend unavailable",
        };
    }
}

// ─── Clipper ──────────────────────────────────────────────────────────────────

export interface ClipperResponse {
    discord_id: string;
    username: string;
    payment_info: string;
    bank_no?: string;
    bank_type?: string;
    pending_balance: number;
    paid_amount: number;
    total_earnings: number;
    total_views: number;
    status: string;
    created_at?: string;
}

export async function fetchClippers(): Promise<ClipperResponse[]> {
    const res = await fetch(`${BACKEND_URL}/api/clippers`, {
        headers: authHeaders,
        cache: "no-store",
    });
    if (!res.ok) throw await buildFetchError("fetchClippers", res);
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
        headers: authHeaders,
        cache: "no-store",
    });
    if (!res.ok) throw await buildFetchError("fetchCampaigns", res);
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
    if (!res.ok) throw await buildFetchError("fetchSubmissions", res);
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
    const res = await fetch(`${BACKEND_URL}/api/payouts?clipper_id=${discordId}`, {
        headers: authHeaders,
        cache: "no-store",
    });
    if (!res.ok) throw await buildFetchError("fetchPayoutsByClipper", res);
    return res.json();
}

function sortByCreatedAtDesc<T extends { created_at?: string }>(items: T[]) {
    return [...items].sort((left, right) => {
        const leftTime = new Date(left.created_at ?? 0).getTime();
        const rightTime = new Date(right.created_at ?? 0).getTime();
        return rightTime - leftTime;
    });
}

function pickEarliestDate(values: Array<string | undefined>) {
    const timestamps = values
        .map((value) => value ? new Date(value).getTime() : NaN)
        .filter((value) => Number.isFinite(value));

    if (!timestamps.length) return undefined;
    return new Date(Math.min(...timestamps)).toISOString();
}

export function enrichClipperProfile(
    clipper: ClipperResponse | null,
    payouts: PayoutResponse[],
    submissions: SubmissionResponse[] = [],
): ClipperResponse | null {
    if (!clipper) return null;

    const latestBank = sortByCreatedAtDesc(
        payouts.filter((payout) => payout.bank_no && payout.bank_type),
    )[0];

    const createdAt = clipper.created_at ?? pickEarliestDate([
        ...payouts.map((payout) => payout.created_at),
        ...submissions.map((submission) => submission.created_at),
    ]);

    return {
        ...clipper,
        bank_no: clipper.bank_no ?? latestBank?.bank_no,
        bank_type: clipper.bank_type ?? latestBank?.bank_type,
        created_at: createdAt,
    };
}

async function fetchBackendWithDiscordAuth<T>(path: string, accessToken: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...(init?.headers ?? {}),
        },
        cache: "no-store",
    });

    const body = await res.json().catch(() => null) as {
        data?: T;
        error?: string;
        message?: string;
        messageTh?: string;
    } | null;

    if (!res.ok) {
        throw new Error(body?.messageTh ?? body?.message ?? body?.error ?? `Request failed with HTTP ${res.status}`);
    }

    return (body?.data ?? body) as T;
}

export async function createSubmissionWithDiscordToken(input: {
    accessToken: string;
    campaign_id: string;
    video_url: string;
}) {
    try {
        const data = await fetchBackendWithDiscordAuth(
            `/backend/api/v1/campaigns/join?campaign_id=${encodeURIComponent(input.campaign_id)}`,
            input.accessToken,
            {
                method: "POST",
                body: JSON.stringify({ video_url: input.video_url }),
            },
        );

        return {
            configured: true,
            ok: true,
            status: 200,
            data,
            error: null,
        } satisfies BackendMutationResult;
    } catch (error) {
        return {
            configured: true,
            ok: false,
            status: 502,
            data: null,
            error: error instanceof Error ? error.message : "Unable to create submission",
        } satisfies BackendMutationResult;
    }
}

export async function createPayoutRequestWithDiscordToken(input: {
    accessToken: string;
    amount: number;
}) {
    try {
        const data = await fetchBackendWithDiscordAuth(
            "/backend/api/v1/withdraws",
            input.accessToken,
            {
                method: "POST",
                body: JSON.stringify({ amount: input.amount }),
            },
        );

        return {
            configured: true,
            ok: true,
            status: 201,
            data,
            error: null,
        } satisfies BackendMutationResult;
    } catch (error) {
        return {
            configured: true,
            ok: false,
            status: 502,
            data: null,
            error: error instanceof Error ? error.message : "Unable to create payout request",
        } satisfies BackendMutationResult;
    }
}

export async function createSubmission(input: {
    discord_id: string;
    campaign_id: string;
    campaign_name: string;
    video_url: string;
}) {
    return proxyConfiguredMutation(
        process.env.PORTAL_SUBMISSION_WRITE_URL,
        "POST",
        input,
    );
}

export async function updateClipperBank(input: {
    discord_id: string;
    bank_no: string;
    bank_type: string;
}) {
    return proxyConfiguredMutation(
        process.env.PORTAL_BANK_UPDATE_URL,
        "PATCH",
        input,
    );
}

export async function createPayoutRequest(input: {
    discord_id: string;
    amount: number;
    bank_no: string;
    bank_type: string;
}) {
    return proxyConfiguredMutation(
        process.env.PORTAL_PAYOUT_REQUEST_URL,
        "POST",
        input,
    );
}

export async function submitBrandInquiry(input: {
    firstName: string;
    lastName: string;
    companyName: string;
    brandName: string;
    email: string;
    phone: string;
    goal: string;
    budget: string;
    timeline: string;
    details: string;
}) {
    return proxyConfiguredMutation(
        process.env.BRAND_INQUIRY_FORWARD_URL,
        "POST",
        input,
        false,
    );
}
