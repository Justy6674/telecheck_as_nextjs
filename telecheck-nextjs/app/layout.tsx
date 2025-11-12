import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/src/index.css";
import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/src/hooks/useAuth";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import "@/src/utils/emailProcessor";
import ClientProviders from "./client-providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeleCheck - Medicare Telehealth Disaster Eligibility',
  description: 'Check Medicare telehealth eligibility based on disaster declarations',
  keywords: ['Medicare', 'Telehealth', 'Disaster', 'Eligibility', 'Healthcare'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-900`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
