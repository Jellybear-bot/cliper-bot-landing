import type { Metadata } from 'next'
import { Inter, IBM_Plex_Mono, Noto_Sans_Thai } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-latin' })
const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    variable: '--font-mono',
})
const notoSansThai = Noto_Sans_Thai({
    subsets: ['thai', 'latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-thai',
})

export const metadata: Metadata = {
    title: 'ClipHunter | The UGC Video Clipping Agency',
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
            <body className={`${notoSansThai.className} ${notoSansThai.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
