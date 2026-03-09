export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(body?.error ?? `HTTP ${res.status}`);
    }

    return body as T;
}
