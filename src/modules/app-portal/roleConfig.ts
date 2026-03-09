import type { CampaignResponse, ClipperResponse } from "@/lib/portalApi";
import { PORTAL_ROLE_OVERRIDE_ENABLED } from "@/lib/portalConfig";

export type PortalRole = "member" | "vip";
export const LOCAL_ROLE_OVERRIDE_KEY = "portal_role_override";

export interface RolePermissions {
    canAccessVipCampaign: boolean;
    dailySubmissionLimit: number;
    minWithdrawAmount: number;
    payoutBonusPercent: number;
}

export const ROLE_PERMISSIONS: Record<PortalRole, RolePermissions> = {
    member: {
        canAccessVipCampaign: false,
        dailySubmissionLimit: 5,
        minWithdrawAmount: 100,
        payoutBonusPercent: 0,
    },
    vip: {
        canAccessVipCampaign: true,
        dailySubmissionLimit: 12,
        minWithdrawAmount: 50,
        payoutBonusPercent: 3,
    },
};

export function getRoleFromClipper(clipper: ClipperResponse | null): PortalRole {
    if (!clipper) return "member";
    const marker = `${clipper.payment_info ?? ""} ${clipper.status ?? ""}`.toLowerCase();
    if (marker.includes("role:vip") || marker.includes("[vip]") || marker.includes(" vip")) {
        return "vip";
    }
    return "member";
}

export function getLocalRoleOverride(): PortalRole | null {
    if (!PORTAL_ROLE_OVERRIDE_ENABLED) return null;
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(LOCAL_ROLE_OVERRIDE_KEY);
    return value === "member" || value === "vip" ? value : null;
}

export function setLocalRoleOverride(role: PortalRole | null) {
    if (!PORTAL_ROLE_OVERRIDE_ENABLED) return;
    if (typeof window === "undefined") return;
    if (!role) {
        window.localStorage.removeItem(LOCAL_ROLE_OVERRIDE_KEY);
    } else {
        window.localStorage.setItem(LOCAL_ROLE_OVERRIDE_KEY, role);
    }
    window.dispatchEvent(new Event("portal-role-updated"));
}

export function resolvePortalRole(clipper: ClipperResponse | null): PortalRole {
    return getLocalRoleOverride() ?? getRoleFromClipper(clipper);
}

export function isVipCampaign(campaign: CampaignResponse): boolean {
    return campaign.campaign_name.toLowerCase().includes("[vip]");
}
