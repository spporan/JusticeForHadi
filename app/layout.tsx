import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { FontLoader } from '@/components/font-loader';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Justice For Hadi',
  description:
    'Create and share powerful photocards to keep Hadi’s call for justice alive.',
  keywords: ['photocard', 'quote maker', 'image editor', 'social media', 'quotes', 'design tool'],
  authors: [{ name: 'Shah Poran' }],
  icons: {
    icon: '/icon-32x32.png',
  },
  openGraph: {
    title: 'Justice For Hadi',
    description: 'Create and share powerful photocards to keep Hadi’s call for justice alive.',
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
    <html lang="en">
      <body className={inter.className}>
        <FontLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
