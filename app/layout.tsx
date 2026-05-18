import type { Metadata } from 'next';
import { Audiowide, Aldrich, Electrolize, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide',
  display: 'swap',
});

const aldrich = Aldrich({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-aldrich',
  display: 'swap',
});

const electrolize = Electrolize({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-electrolize',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TIIV Manager',
  description: 'A game assistant for Twilight Imperium 4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${audiowide.variable} ${aldrich.variable} ${electrolize.variable} ${shareTechMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
