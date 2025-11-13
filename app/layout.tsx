import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/utils/emailProcessor";
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
