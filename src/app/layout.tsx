import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'DineEasy - Collaborative Restaurant Ordering',
    description: 'Order together, pay separately. The future of restaurant dining.',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    themeColor: '#ef4444',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'DineEasy',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="min-h-screen bg-background">
                    {children}
                </main>
                <Toaster />
            </body>
        </html>
    )
}