import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';

const Navbar = dynamic(() => import('@/components/layout/Navbar').then(mod => ({ default: mod.Navbar })), { ssr: false });

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://calldesk.bg'),
  title: 'CallDesk - AI Рецепционист за Салони',
  description: 'Автоматизирано приемане на обаждания и записване на часове за фризьорски и козметични салони в България. Работи 24/7.',
  keywords: ['AI рецепционист', 'автоматично записване', 'салони България', 'фризьорски салон', 'козметичен салон', 'CallDesk'],
  openGraph: {
    title: 'CallDesk - AI Рецепционист за Салони',
    description: 'Автоматизирано приемане на обаждания и записване на часове за салони',
    type: 'website',
    locale: 'bg_BG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CallDesk AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallDesk - AI Рецепционист за Салони',
    description: 'Автоматизирано приемане на обаждания и записване на часове',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
