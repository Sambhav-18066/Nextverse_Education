import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/header';
import SpaceBackground from '@/components/landing/space-background';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'NextVerse Education',
  description: 'Your Learning Universe',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased relative">
        <FirebaseClientProvider>
          <SpaceBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
