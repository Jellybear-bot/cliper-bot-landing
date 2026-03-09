export const FORCE_PORTAL_MOCK_MODE = process.env.NEXT_PUBLIC_PORTAL_MOCK_MODE === "true";

const FALLBACK_TO_MOCKS_DISABLED = process.env.NEXT_PUBLIC_PORTAL_FALLBACK_TO_MOCKS === "false";

export const PORTAL_CAN_FALLBACK_TO_MOCKS =
    FORCE_PORTAL_MOCK_MODE || (process.env.NODE_ENV !== "production" && !FALLBACK_TO_MOCKS_DISABLED);

export const PORTAL_ROLE_OVERRIDE_ENABLED =
    process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_PORTAL_ENABLE_ROLE_OVERRIDE !== "false";

export function shouldUsePortalMockData(hasError: boolean) {
    return FORCE_PORTAL_MOCK_MODE || (hasError && PORTAL_CAN_FALLBACK_TO_MOCKS);
}
