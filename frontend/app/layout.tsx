import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/feedback/toaster"
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "./providers"
import { AchievementNotification } from '../components/achievements/AchievementNotification';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Oku Yorum",
  description: "Kitap alıntıları ve yorumları paylaşabileceğiniz bir platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <AchievementNotification />
            {children}
          </Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
