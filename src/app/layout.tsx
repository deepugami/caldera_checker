import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";

export const metadata: Metadata = {
  title: "Caldera Token Allocation Checker",
  description: "Check your eligibility for Caldera token allocation based on Discord roles and on-chain activity",
  keywords: "Caldera, token allocation, crypto, blockchain, eligibility checker",
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#000000',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full m-0 p-0 w-full overflow-x-hidden">
        <Background />
        <main className="relative z-10 min-h-screen w-full flex items-center justify-center p-0 m-0">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
            <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
