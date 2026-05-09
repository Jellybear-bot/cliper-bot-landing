import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LEGACY_PORTAL_SESSION_COOKIE, PORTAL_SESSION_COOKIE } from '@/lib/auth-constants'
import { AppShell } from '@/modules/app-portal/layouts/AppShell'

export const metadata: Metadata = {
    title: 'Dashboard | ClipHunter',
    description: 'Manage your verified links and campaigns',
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = cookies()
    const session = cookieStore.get(PORTAL_SESSION_COOKIE) ?? cookieStore.get(LEGACY_PORTAL_SESSION_COOKIE)

    if (!session?.value) {
        redirect('/login')
    }

    return <AppShell>{children}</AppShell>
}
