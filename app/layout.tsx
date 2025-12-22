'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useStore } from "@/lib/store";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { path, user } = useStore();
  const isAuthPage = path === '/login' || path === '/signup';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isAuthPage && <Navigation user={user} />}

        <main>
          {children}
        </main>

        {!isAuthPage && (
          <footer className="py-12 border-t border-gray-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; 2025 Jamii Rental Community. All rights reserved.
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}
