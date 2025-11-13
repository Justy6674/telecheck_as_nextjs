import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * Transforms React Router v6 code to Next.js App Router
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const filename = root.filename();
  const edits: Edit[] = [];

  // 1. Transform react-router-dom imports to next/navigation
  const routerImports = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'import { $$$IMPORTS } from "react-router-dom"' },
        { pattern: "import { $$$IMPORTS } from 'react-router-dom'" }
      ]
    }
  });

  routerImports.forEach(importNode => {
    const imports = importNode.getMultipleMatches("IMPORTS");
    const importNames = imports.map(n => n.text()).join(", ");

    // Map React Router hooks to Next.js equivalents
    let nextImports: string[] = [];
    if (importNames.includes("useNavigate")) {
      nextImports.push("useRouter");
    }
    if (importNames.includes("useLocation")) {
      nextImports.push("usePathname", "useSearchParams");
    }
    if (importNames.includes("useParams")) {
      nextImports.push("useParams");
    }
    if (importNames.includes("Link")) {
      // Link will be imported separately from next/link
    }

    if (nextImports.length > 0) {
      edits.push(importNode.replace(`import { ${nextImports.join(", ")} } from "next/navigation"`));
    }

    // Add next/link import if Link was used
    if (importNames.includes("Link")) {
      edits.push({
        startPos: importNode.range().end.index,
        endPos: importNode.range().end.index,
        insertedText: `\nimport Link from "next/link"`
      });
    }
  });

  // 2. Transform useNavigate to useRouter
  const navigateHooks = rootNode.findAll({
    rule: { pattern: "const $VAR = useNavigate()" }
  });

  navigateHooks.forEach(hook => {
    const varName = hook.getMatch("VAR");
    if (varName) {
      // Replace hook call
      edits.push(hook.replace("const router = useRouter()"));

      // Replace all navigate() calls with router.push()
      const navigateCalls = rootNode.findAll({
        rule: { pattern: `${varName.text()}($PATH)` }
      });

      navigateCalls.forEach(call => {
        const path = call.getMatch("PATH");
        if (path) {
          edits.push(call.replace(`router.push(${path.text()})`));
        }
      });
    }
  });

  // 3. Transform useLocation to usePathname
  const locationHooks = rootNode.findAll({
    rule: { pattern: "const $VAR = useLocation()" }
  });

  locationHooks.forEach(hook => {
    edits.push(hook.replace("const pathname = usePathname()"));
  });

  // 4. Transform BrowserRouter wrapper (in App.tsx)
  if (filename.includes("App.tsx")) {
    const browserRouter = rootNode.find({
      rule: { pattern: "<BrowserRouter>$$$CHILDREN</BrowserRouter>" }
    });

    if (browserRouter) {
      const children = browserRouter.getMultipleMatches("CHILDREN");
      const childrenText = children.map(c => c.text()).join("");
      edits.push(browserRouter.replace(childrenText));
    }
  }

  // 5. Transform Routes and Route components (will be handled by separate page migration)
  const routesComponent = rootNode.find({
    rule: { pattern: "<Routes>$$$ROUTES</Routes>" }
  });

  if (routesComponent) {
    // Mark for removal as pages will be file-based
    edits.push(routesComponent.replace("{/* Routes migrated to app directory */}"));
  }

  // 6. Transform Navigate component to redirect
  const navigateComponents = rootNode.findAll({
    rule: {
      any: [
        { pattern: '<Navigate to="$PATH" />' },
        { pattern: '<Navigate to="$PATH" replace />' }
      ]
    }
  });

  navigateComponents.forEach(nav => {
    const path = nav.getMatch("PATH");
    if (path) {
      // Add redirect import if not present
      const hasRedirectImport = rootNode.find({
        rule: { pattern: 'import { redirect } from "next/navigation"' }
      });

      if (!hasRedirectImport) {
        edits.push({
          startPos: 0,
          endPos: 0,
          insertedText: 'import { redirect } from "next/navigation";\n'
        });
      }

      edits.push(nav.replace(`{redirect(${path.text()})}`));
    }
  });

  // Apply edits if any changes were made
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;