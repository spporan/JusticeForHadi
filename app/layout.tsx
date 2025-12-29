import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import './fonts.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Photocard Studio - Create Beautiful Quote Cards',
  description:
    'Create stunning photocards with custom quotes. Drag, resize, and style text on beautiful images. Export as high-quality PNG or share directly to social media.',
  keywords: ['photocard', 'quote maker', 'image editor', 'social media', 'quotes', 'design tool'],
  authors: [{ name: 'Photocard Studio' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Photocard Studio',
    description: 'Create stunning photocards with custom quotes',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
