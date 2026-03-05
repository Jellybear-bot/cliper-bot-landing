import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CrowdClip Media | The UGC Video Clipping Agency',
    description: 'Performance-based short video marketing. Pay only for real views. 1 Million views guaranteed.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
