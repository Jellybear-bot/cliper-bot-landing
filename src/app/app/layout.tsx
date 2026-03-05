import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppShell } from '@/modules/app-portal/layouts/AppShell'

export const metadata: Metadata = {
    title: 'Dashboard | CrowdClip',
    description: 'Manage your verified links and campaigns',
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check for the mock session cookie
    const cookieStore = cookies()
    const session = cookieStore.get('mock_session')

    if (!session?.value) {
        redirect('/login')
    }

    return <AppShell>{children}</AppShell>
}
