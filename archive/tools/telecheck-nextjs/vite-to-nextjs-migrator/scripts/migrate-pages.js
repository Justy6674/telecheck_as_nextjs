#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of React Router paths to Next.js app directory structure
const routeMapping = {
  '/': 'page.tsx',
  '/members': 'members/page.tsx',
  '/pricing': 'pricing/page.tsx',
  '/telehealth-rules': 'telehealth-rules/page.tsx',
  '/how-to-use': 'how-to-use/page.tsx',
  '/faq': 'faq/page.tsx',
  '/about': 'about/page.tsx',
  '/terms': 'terms/page.tsx',
  '/privacy': 'privacy/page.tsx',
  '/disclaimers': 'disclaimers/page.tsx',
  '/contact': 'contact/page.tsx',
  '/refund-policy': 'refund-policy/page.tsx',
  '/admin': 'admin/page.tsx',
  '/settings': 'settings/page.tsx',
  '/clinic-analysis': 'clinic-analysis/page.tsx',
  '/saved-reports': 'saved-reports/page.tsx',
  '/subscription-success': 'subscription-success/page.tsx',
  '/reports': 'reports/page.tsx',
  '/member-setup': 'member-setup/page.tsx',
  '*': 'not-found.tsx', // 404 page
};

// Pages that require authentication
const protectedPages = [
  'members',
  'admin',
  'settings',
  'clinic-analysis',
  'saved-reports',
  'reports',
  'member-setup'
];

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

function createLayoutFile(dirPath, isProtected = false) {
  const layoutPath = path.join(dirPath, 'layout.tsx');

  if (fs.existsSync(layoutPath)) {
    console.log(`⏭️  Layout already exists: ${layoutPath}`);
    return;
  }

  const layoutContent = isProtected ? `"use client";

import { RequireAdmin } from '@/components/RequireAdmin';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAdmin>{children}</RequireAdmin>;
}` : `export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`;

  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ Created layout: ${layoutPath}`);
}

function migratePages() {
  console.log('🚀 Starting page migration to Next.js app directory...\n');

  const srcPagesDir = path.join(process.cwd(), 'src', 'pages');
  const appDir = path.join(process.cwd(), 'app');

  // Ensure app directory exists
  ensureDirectoryExists(appDir);

  // Create API directory
  ensureDirectoryExists(path.join(appDir, 'api'));

  // Read all page files from src/pages
  if (!fs.existsSync(srcPagesDir)) {
    console.error('❌ Source pages directory not found:', srcPagesDir);
    return;
  }

  const pageFiles = fs.readdirSync(srcPagesDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

  console.log(`📁 Found ${pageFiles.length} page files to migrate\n`);

  // Process each page file
  pageFiles.forEach(file => {
    const fileName = file.replace(/\.(tsx|jsx)$/, '');
    const sourcePath = path.join(srcPagesDir, file);

    // Find matching route
    let targetPath = null;

    // Map common page names to routes
    const pageNameToRoute = {
      'Landing': '',
      'Members': 'members',
      'Pricing': 'pricing',
      'TelehealthRules': 'telehealth-rules',
      'HowToUse': 'how-to-use',
      'FAQ': 'faq',
      'About': 'about',
      'Terms': 'terms',
      'Privacy': 'privacy',
      'Disclaimers': 'disclaimers',
      'Contact': 'contact',
      'RefundPolicy': 'refund-policy',
      'Admin': 'admin',
      'Settings': 'settings',
      'ClinicAnalysis': 'clinic-analysis',
      'SavedReportsDashboard': 'saved-reports',
      'SubscriptionSuccess': 'subscription-success',
      'Reports': 'reports',
      'MemberSetup': 'member-setup',
      'NotFound': 'not-found'
    };

    const route = pageNameToRoute[fileName];

    if (route !== undefined) {
      if (route === '') {
        targetPath = path.join(appDir, 'page.tsx');
      } else if (route === 'not-found') {
        targetPath = path.join(appDir, 'not-found.tsx');
      } else {
        const dirPath = path.join(appDir, route);
        ensureDirectoryExists(dirPath);

        // Create layout for protected routes
        if (protectedPages.includes(route)) {
          createLayoutFile(dirPath, route === 'admin');
        }

        targetPath = path.join(dirPath, 'page.tsx');
      }

      // Copy the file
      if (targetPath) {
        const content = fs.readFileSync(sourcePath, 'utf-8');

        // Apply basic transformations
        let transformedContent = content;

        // Add "use client" if needed (will be refined by codemod)
        if (content.includes('useState') || content.includes('useEffect') || content.includes('onClick')) {
          transformedContent = '"use client";\n\n' + transformedContent;
        }

        // Write to new location
        fs.writeFileSync(targetPath, transformedContent);
        console.log(`✅ Migrated: ${file} → ${targetPath}`);
      }
    } else {
      console.log(`⚠️  Skipped: ${file} (no route mapping)`);
    }
  });

  // Create root layout
  const rootLayoutPath = path.join(appDir, 'layout.tsx');
  if (!fs.existsSync(rootLayoutPath)) {
    const rootLayoutContent = `import '@/index.css';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TeleCheck - Medicare Telehealth Disaster Eligibility',
  description: 'Check Medicare telehealth eligibility based on disaster declarations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <ThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}`;

    fs.writeFileSync(rootLayoutPath, rootLayoutContent);
    console.log(`✅ Created root layout: ${rootLayoutPath}`);
  }

  console.log('\n✨ Page migration complete!');
  console.log('📝 Note: Run the codemod transformations to complete the migration.');
}

// Run the migration
migratePages();