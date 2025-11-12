import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * Transforms React components to follow Next.js conventions
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const filename = root.filename();
  const edits: Edit[] = [];

  // Check if this is a page component based on file path
  const isPageComponent = filename.includes("/pages/") || filename.includes("/app/");
  const isLayoutComponent = filename.includes("layout.tsx") || filename.includes("Layout.tsx");
  const isApiRoute = filename.includes("/api/") && filename.endsWith(".ts");

  // 1. Handle API routes
  if (isApiRoute) {
    const defaultExport = rootNode.find({
      rule: { pattern: "export default $HANDLER" }
    });

    if (defaultExport) {
      const handler = defaultExport.getMatch("HANDLER");
      if (handler) {
        // Transform to Next.js API route handlers
        edits.push(defaultExport.replace(`
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  ${handler.text()}
}

export async function POST(request: NextRequest) {
  ${handler.text()}
}`));
      }
    }
    return edits.length > 0 ? rootNode.commitEdits(edits) : null;
  }

  // 2. Detect if component needs "use client" directive
  const needsUseClient =
    rootNode.find({ rule: { pattern: "useState($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useEffect($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useReducer($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useCallback($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useMemo($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useRef($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useContext($$$)" } }) ||
    rootNode.find({ rule: { pattern: "onClick={$$$}" } }) ||
    rootNode.find({ rule: { pattern: "onChange={$$$}" } }) ||
    rootNode.find({ rule: { pattern: "onSubmit={$$$}" } }) ||
    // Check for Outseta authentication
    rootNode.find({ rule: { pattern: "window.Outseta" } }) ||
    rootNode.find({ rule: { pattern: "data-o-auth" } });

  const hasUseClient = rootNode.find({
    rule: { pattern: '"use client"' }
  });

  if (needsUseClient && !hasUseClient) {
    edits.push({
      startPos: 0,
      endPos: 0,
      insertedText: '"use client";\n\n'
    });
  }

  // 3. Transform page components to include metadata export
  if (isPageComponent && !isLayoutComponent) {
    const defaultExport = rootNode.find({
      rule: {
        any: [
          { pattern: "export default function $NAME() { $$$BODY }" },
          { pattern: "export default function $NAME($PROPS) { $$$BODY }" },
          { pattern: "const $NAME = () => { $$$BODY }; export default $NAME" },
          { pattern: "const $NAME = ($PROPS) => { $$$BODY }; export default $NAME" }
        ]
      }
    });

    if (defaultExport) {
      const componentName = defaultExport.getMatch("NAME");
      if (componentName) {
        const pageName = componentName.text().replace(/Page$/i, "");

        // Add metadata export for SEO
        const hasMetadata = rootNode.find({
          rule: { pattern: "export const metadata" }
        });

        if (!hasMetadata && !needsUseClient) {
          // Only add metadata for server components
          edits.push({
            startPos: defaultExport.range().start.index,
            endPos: defaultExport.range().start.index,
            insertedText: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${pageName} - TeleCheck',
  description: 'Medicare Telehealth Disaster Eligibility Checker',
};

`
          });
        }
      }
    }
  }

  // 4. Transform layout components
  if (isLayoutComponent) {
    const defaultExport = rootNode.find({
      rule: {
        any: [
          { pattern: "export default function $NAME($PROPS) { $$$BODY }" },
          { pattern: "const $NAME = ($PROPS) => { $$$BODY }; export default $NAME" }
        ]
      }
    });

    if (defaultExport) {
      const props = defaultExport.getMatch("PROPS");

      // Ensure layout has children prop
      if (props && !props.text().includes("children")) {
        const newProps = props.text() === "()" ? "({ children }: { children: React.ReactNode })" : props.text().replace(")", ", children }");

        // Find and replace the function signature
        const functionDeclaration = rootNode.find({
          rule: { pattern: `function $NAME(${props.text()})` }
        });

        if (functionDeclaration) {
          edits.push(functionDeclaration.replace(`function ${functionDeclaration.getMatch("NAME")?.text()}${newProps}`));
        }
      }

      // Add root layout metadata
      const hasMetadata = rootNode.find({
        rule: { pattern: "export const metadata" }
      });

      if (!hasMetadata && filename.includes("root") && !needsUseClient) {
        edits.push({
          startPos: 0,
          endPos: 0,
          insertedText: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'TeleCheck - Medicare Telehealth Disaster Eligibility',
    template: '%s | TeleCheck',
  },
  description: 'Check Medicare telehealth eligibility based on disaster declarations',
  keywords: ['Medicare', 'Telehealth', 'Disaster', 'Eligibility', 'Healthcare'],
};

`
        });
      }
    }
  }

  // 5. Transform loading states
  const loadingStates = rootNode.findAll({
    rule: { pattern: "{loading && $LOADING_UI}" }
  });

  if (loadingStates.length > 0 && filename.includes("loading.tsx")) {
    // Convert to Next.js loading.tsx convention
    const defaultExport = rootNode.find({
      rule: { pattern: "export default" }
    });

    if (!defaultExport) {
      edits.push({
        startPos: rootNode.range().end.index,
        endPos: rootNode.range().end.index,
        insertedText: `
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}`
      });
    }
  }

  // 6. Transform error boundaries
  if (filename.includes("error.tsx")) {
    const hasUseClient = rootNode.find({
      rule: { pattern: '"use client"' }
    });

    if (!hasUseClient) {
      edits.push({
        startPos: 0,
        endPos: 0,
        insertedText: '"use client";\n\n'
      });
    }

    const defaultExport = rootNode.find({
      rule: { pattern: "export default" }
    });

    if (!defaultExport) {
      edits.push({
        startPos: rootNode.range().end.index,
        endPos: rootNode.range().end.index,
        insertedText: `
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}`
      });
    }
  }

  // 7. Handle Suspense boundaries
  const suspenseImport = rootNode.find({
    rule: { pattern: "import { Suspense } from 'react'" }
  });

  const suspenseUsage = rootNode.find({
    rule: { pattern: "<Suspense fallback={$FALLBACK}>$$$CHILDREN</Suspense>" }
  });

  if (suspenseUsage && !suspenseImport) {
    // Add Suspense import if used but not imported
    edits.push({
      startPos: 0,
      endPos: 0,
      insertedText: "import { Suspense } from 'react';\n"
    });
  }

  // Apply edits if any changes were made
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;