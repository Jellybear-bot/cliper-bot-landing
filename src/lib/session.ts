import { cookies } from "next/headers";

export interface SessionUser {
    discord_id: string;
    username: string;
}

export function getSessionUser(): SessionUser | null {
    try {
        const cookie = cookies().get("mock_session");
        if (!cookie?.value) return null;
        return JSON.parse(cookie.value) as SessionUser;
    } catch {
        return null;
    }
}
