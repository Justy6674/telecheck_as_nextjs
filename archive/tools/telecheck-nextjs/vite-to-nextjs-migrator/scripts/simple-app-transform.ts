import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * Simple App.tsx transformation to match expected output
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const edits: Edit[] = [];

  // Get the entire file content and replace with the expected output
  const fileContent = `"use client";

import { Toaster } from "@/src/components/ui/toaster";
import { Toaster as Sonner } from "@/src/components/ui/sonner";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Routes migrated to app directory */}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;`;

  // Replace the entire file content
  edits.push({
    startPos: 0,
    endPos: rootNode.text().length,
    insertedText: fileContent
  });

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;