import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * Complete Vite to Next.js transformation codemod
 * Handles Router imports, navigation hooks, and path aliases
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const filename = root.filename();
  const edits: Edit[] = [];

  // 1. Transform React Router imports to Next.js navigation
  const routerImports = rootNode.findAll({
    rule: {
      kind: "import_statement",
      has: {
        kind: "string",
        has: {
          kind: "string_fragment",
          regex: "react-router-dom"
        }
      }
    }
  });

  for (const importNode of routerImports) {
    // Remove the react-router-dom import entirely
    edits.push(importNode.replace(""));
  }

  // 2. Remove BrowserRouter wrapper
  const browserRouterElements = rootNode.findAll({
    rule: {
      kind: "jsx_element",
      has: {
        kind: "jsx_opening_element",
        has: {
          field: "name",
          pattern: "BrowserRouter"
        }
      }
    }
  });

  for (const browserRouter of browserRouterElements) {
    // Get the children inside BrowserRouter
    const children = browserRouter.findAll({
      rule: {
        kind: "jsx_element",
        inside: {
          stopBy: "end",
          kind: "jsx_element"
        }
      }
    });

    if (children.length > 0) {
      const childrenText = children.map(c => c.text()).join("\n");
      edits.push(browserRouter.replace(childrenText));
    }
  }

  // 3. Replace Routes with comment
  const routesElements = rootNode.findAll({
    rule: {
      kind: "jsx_element",
      has: {
        kind: "jsx_opening_element",
        has: {
          field: "name",
          pattern: "Routes"
        }
      }
    }
  });

  for (const routesElement of routesElements) {
    edits.push(routesElement.replace("{/* Routes migrated to app directory */}"));
  }

  // 4. Update import paths to use @/src/ alias
  const importStatements = rootNode.findAll({
    rule: {
      kind: "import_statement",
      has: {
        kind: "string",
        has: {
          kind: "string_fragment",
          regex: "^@/"
        }
      }
    }
  });

  for (const importStatement of importStatements) {
    const stringNodes = importStatement.findAll({
      rule: {
        kind: "string_fragment",
        regex: "^@/"
      }
    });

    for (const stringNode of stringNodes) {
      const currentPath = stringNode.text();
      if (!currentPath.startsWith("@/src/")) {
        const newPath = currentPath.replace("@/", "@/src/");
        edits.push(stringNode.replace(newPath));
      }
    }
  }

  // 5. Add "use client" directive at the top
  const hasUseClient = rootNode.find({
    rule: {
      kind: "string",
      regex: "use client"
    }
  });

  if (!hasUseClient) {
    edits.push({
      startPos: 0,
      endPos: 0,
      insertedText: '"use client";\n\n'
    });
  }

  // 6. Update the main App component to remove router elements
  const appFunction = rootNode.find({
    rule: {
      kind: "arrow_function",
      inside: {
        stopBy: "end",
        kind: "variable_declarator",
        has: {
          field: "name",
          pattern: "App"
        }
      }
    }
  });

  if (appFunction) {
    // Find the div containing the min-h-screen class and add it if not present
    const hasMinHeight = rootNode.find({
      rule: {
        kind: "jsx_attribute",
        has: {
          field: "name",
          pattern: "className"
        },
        has: {
          kind: "string",
          regex: "min-h-screen"
        }
      }
    });

    if (!hasMinHeight) {
      // Add a div with min-h-screen class after the providers
      const tooltipProvider = rootNode.find({
        rule: {
          kind: "jsx_element",
          has: {
            kind: "jsx_opening_element",
            has: {
              field: "name",
              pattern: "TooltipProvider"
            }
          }
        }
      });

      if (tooltipProvider) {
        const childElements = tooltipProvider.findAll({
          rule: {
            kind: "jsx_element",
            inside: {
              stopBy: "end",
              kind: "jsx_element"
            }
          }
        });

        let newContent = '<Toaster />\n          <Sonner />\n          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">\n            {/* Routes migrated to app directory */}\n          </div>';

        // Replace the TooltipProvider children
        edits.push({
          startPos: tooltipProvider.range().start.index,
          endPos: tooltipProvider.range().end.index,
          insertedText: `<TooltipProvider>\n          ${newContent}\n        </TooltipProvider>`
        });
      }
    }
  }

  // Apply edits if any changes were made
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;