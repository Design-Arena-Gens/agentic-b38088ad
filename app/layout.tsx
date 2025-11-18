import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Strong Miracles ? Reel',
  description: 'A short, emotional scene-based story of strength and love.',
  openGraph: {
    title: 'Strong Miracles ? Reel',
    description: 'A short, emotional scene-based story of strength and love.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576765974027-c9ae0b9e09b0?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Parents with newborn',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
