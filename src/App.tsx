import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import Members from "./pages/Members";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { TelehealthRules } from "./pages/TelehealthRules";
import { HowToUse } from "./pages/HowToUse";
import { FAQ } from "./pages/FAQ";
import { About } from "./pages/About";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Disclaimers } from "./pages/Disclaimers";
import { Contact } from "./pages/Contact";
import { RefundPolicy } from "./pages/RefundPolicy";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import ClinicAnalysis from "./pages/ClinicAnalysis";
import { SavedReportsDashboard } from "./components/SavedReportsDashboard";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Reports from "./pages/Reports";
import MemberSetup from "./pages/MemberSetup";
import { AuthProvider } from "./hooks/useAuth";
import { RequireAdmin } from "./components/RequireAdmin";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./utils/emailProcessor"; // Auto-process emails

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is immediately stale
      gcTime: 0, // No garbage collection time (was cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false, // No retries to prevent stale data
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/members" element={<Members />} />
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription-success" element={<SubscriptionSuccess />} />
              <Route path="/members/setup" element={<MemberSetup />} />
              {/* Removed Supabase auth routes - Outseta handles all auth */}
              <Route path="/telehealth-rules" element={<TelehealthRules />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimers" element={<Disclaimers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/clinic-analysis" element={<ClinicAnalysis />} />
              <Route path="/reports" element={<Reports />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;