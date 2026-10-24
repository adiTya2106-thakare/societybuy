import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SocietyBuy — Buy Together. Save Together.",
    template: "%s | SocietyBuy",
  },
  description:
    "Community bulk shopping platform for residential societies. Buy daily essentials together and unlock better prices from local suppliers.",
  keywords: ["bulk shopping", "society", "community buying", "grocery", "delivery"],
  openGraph: {
    title: "SocietyBuy — Buy Together. Save Together.",
    description: "Community bulk shopping for residential societies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
