import { NavigationEvents } from '@/components/NavigationEvents'
import { NavigationProgress } from '@/components/NavigationProgress'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SimpleLink - Affiliate Product Showcase',
  description: 'Create beautiful storefronts for your affiliate products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <NavigationProgress />
          <NavigationEvents />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
