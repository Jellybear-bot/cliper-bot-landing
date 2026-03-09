"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, CalendarClock, Eye, Coins } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FORCE_PORTAL_MOCK_MODE, shouldUsePortalMockData } from "@/lib/portalConfig";
import { useSubmissions } from "@/lib/portalApi";
import type { SubmissionResponse } from "@/lib/portalApi";
import { MOCK_SUBMISSIONS } from "@/modules/app-portal/mockData";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const fmtCurrency = (n: number) => `฿${fmt(n)}`;
const toDayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

interface DailyRow {
    day: string;
    views: number;
    earnings: number;
    cumulativeViews: number;
    cumulativeEarnings: number;
}

interface CampaignSummary {
    campaignName: string;
    totalViews: number;
    totalEarnings: number;
    daysActive: number;
    dailyRows: DailyRow[];
}

export function EarningsPage() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const e = t.app.earnings;
    const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const { data: submissions, loading, error } = useSubmissions();
    const shouldMock = shouldUsePortalMockData(Boolean(error) && !loading);
    const list = shouldMock ? MOCK_SUBMISSIONS : (submissions ?? []);

    const campaigns = useMemo<CampaignSummary[]>(() => {
        const byCampaign = new Map<string, SubmissionResponse[]>();

        for (const sub of list) {
            const group = byCampaign.get(sub.campaign_name) ?? [];
            group.push(sub);
            byCampaign.set(sub.campaign_name, group);
        }

        return Array.from(byCampaign.entries()).map(([campaignName, subs]) => {
            const totalViews = subs.reduce((sum, x) => sum + x.play_count, 0);
            const totalEarnings = subs.reduce((sum, x) => sum + x.calculated_payout, 0);

            const byDay = new Map<string, { views: number; earnings: number }>();
            for (const sub of subs) {
                const day = toDayKey(sub.created_at);
                const current = byDay.get(day) ?? { views: 0, earnings: 0 };
                current.views += sub.play_count;
                current.earnings += sub.calculated_payout;
                byDay.set(day, current);
            }

            const sortedDays = Array.from(byDay.entries()).sort((a, b) => a[0].localeCompare(b[0]));
            const minDay = sortedDays[0]?.[0];
            const maxDay = sortedDays[sortedDays.length - 1]?.[0];
            const daysActive = minDay && maxDay
                ? Math.max(1, Math.floor((new Date(maxDay).getTime() - new Date(minDay).getTime()) / 86400000) + 1)
                : 1;

            let runningViews = 0;
            let runningEarnings = 0;
            const dailyRowsAsc = sortedDays.map(([day, values]) => {
                runningViews += values.views;
                runningEarnings += values.earnings;
                return {
                    day,
                    views: values.views,
                    earnings: values.earnings,
                    cumulativeViews: runningViews,
                    cumulativeEarnings: runningEarnings,
                };
            });

            return {
                campaignName,
                totalViews,
                totalEarnings,
                daysActive,
                dailyRows: dailyRowsAsc.reverse(),
            };
        }).sort((a, b) => b.totalEarnings - a.totalEarnings);
    }, [list]);

    const visibleCampaigns = searchQuery
        ? campaigns.filter((campaign) => campaign.campaignName.toLowerCase().includes(searchQuery))
        : campaigns;

    const [selectedCampaign, setSelectedCampaign] = useState("");

    useEffect(() => {
        if (!visibleCampaigns.length) {
            setSelectedCampaign("");
            return;
        }
        const exists = visibleCampaigns.some((campaign) => campaign.campaignName === selectedCampaign);
        if (!exists) {
            setSelectedCampaign(visibleCampaigns[0].campaignName);
        }
    }, [visibleCampaigns, selectedCampaign]);

    const activeCampaign = visibleCampaigns.find((campaign) => campaign.campaignName === selectedCampaign) ?? visibleCampaigns[0];

    return (
        <div className="space-y-7 pb-12 w-full">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{e.title}</h1>
                <p className="text-slate-500 text-sm font-medium">{e.subtitle}</p>
            </div>

            {shouldMock && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
                    {FORCE_PORTAL_MOCK_MODE
                        ? "⚠️ เปิดโหมดข้อมูลจำลองชั่วคราว (NEXT_PUBLIC_PORTAL_MOCK_MODE=true)"
                        : "⚠️ ขณะนี้ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลจำลองชั่วคราวในโหมด dev"}
                    {error && <span className="block text-xs mt-1">submissions: {error}</span>}
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{e.selectCampaign}</p>
                <div className="flex gap-2 flex-wrap">
                    {visibleCampaigns.map((campaign) => (
                        <button
                            key={campaign.campaignName}
                            onClick={() => setSelectedCampaign(campaign.campaignName)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCampaign === campaign.campaignName
                                ? "bg-blue-600 text-white"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}
                        >
                            {campaign.campaignName}
                        </button>
                    ))}
                </div>
            </div>

            {!activeCampaign ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                    <BarChart3 size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">{searchQuery ? `No campaigns match "${searchQuery}"` : e.noData}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <SummaryCard label={e.totalEarnings} value={fmtCurrency(activeCampaign.totalEarnings)} icon={<Coins size={18} />} color="text-emerald-600" />
                        <SummaryCard label={e.totalViews} value={fmt(activeCampaign.totalViews)} icon={<Eye size={18} />} color="text-blue-600" />
                        <SummaryCard label={e.daysActive} value={`${activeCampaign.daysActive}`} icon={<CalendarClock size={18} />} color="text-violet-600" />
                        <SummaryCard
                            label={e.avgPerDay}
                            value={fmtCurrency(Math.round(activeCampaign.totalEarnings / Math.max(1, activeCampaign.daysActive)))}
                            icon={<BarChart3 size={18} />}
                            color="text-amber-600"
                        />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800 text-sm">{e.dailyGrowth}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="text-left font-bold px-5 py-3">{e.day}</th>
                                        <th className="text-right font-bold px-5 py-3">{e.earningIncrease}</th>
                                        <th className="text-right font-bold px-5 py-3">{e.viewsIncrease}</th>
                                        <th className="text-right font-bold px-5 py-3">{e.cumulativeEarnings}</th>
                                        <th className="text-right font-bold px-5 py-3">{e.cumulativeViews}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeCampaign.dailyRows.map((row) => (
                                        <tr key={row.day} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-slate-700">
                                                {new Date(row.day).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-5 py-3 text-right font-bold text-emerald-600">+{fmtCurrency(row.earnings)}</td>
                                            <td className="px-5 py-3 text-right font-bold text-blue-600">+{fmt(row.views)}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-slate-700">{fmtCurrency(row.cumulativeEarnings)}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-slate-700">{fmt(row.cumulativeViews)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl bg-slate-50 ${color} flex items-center justify-center mb-3`}>{icon}</div>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}
