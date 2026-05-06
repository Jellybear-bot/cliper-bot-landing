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
        <html lang="th" suppressHydrationWarning>
            <head>
                {/* Anti-flicker: apply dark class before paint */}
                <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('crowdclip-theme');var p=window.matchMedia('(prefers-color-scheme:dark)').matches;if(s==='dark'||(s===null&&p)){document.documentElement.classList.add('dark')}})()` }} />
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
