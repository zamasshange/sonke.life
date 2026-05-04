import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

// Using system Helvetica Neue - no need to load custom font
// Will fall back to Helvetica, Arial, sans-serif

export const metadata: Metadata = {
  title: 'SONKE | Life Cost & Income Reality Tool',
  description: 'Calculate real living costs, digital costs, income pressure, savings opportunities, and country-adjusted monthly expenses.',
  generator: 'v0.app',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
