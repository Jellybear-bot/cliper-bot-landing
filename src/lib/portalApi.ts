"use client";

import { useEffect, useState } from "react";
import type { ClipperResponse, CampaignResponse, SubmissionResponse, PayoutResponse } from "./backend";

export type { ClipperResponse, CampaignResponse, SubmissionResponse, PayoutResponse };

// ─── Generic fetch hook ───────────────────────────────────────────────────────

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

function useFetch<T>(url: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body?.error ?? `HTTP ${res.status}`);
                }
                return res.json() as Promise<T>;
            })
            .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
            .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });

        return () => { cancelled = true; };
    }, [url, tick]);

    return { data, loading, error, refetch: () => setTick((t) => t + 1) };
}

// ─── Portal hooks ─────────────────────────────────────────────────────────────

export function useMe() {
    return useFetch<ClipperResponse>("/api/portal/me");
}

export function useCampaigns() {
    return useFetch<CampaignResponse[]>("/api/portal/campaigns");
}

export function useSubmissions() {
    return useFetch<SubmissionResponse[]>("/api/portal/submissions");
}

export function usePayouts() {
    return useFetch<PayoutResponse[]>("/api/portal/payouts");
}

export interface DailyPoint {
    date: string;
    views: number;
    earnings: number;
}

export interface StatsResponse {
    daily: DailyPoint[];
    today_earnings: number;
    streak_days: number;
}

export function useStats() {
    return useFetch<StatsResponse>("/api/portal/stats");
}
