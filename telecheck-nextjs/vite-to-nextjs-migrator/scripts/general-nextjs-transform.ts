import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * General Next.js transformation codemod
 * Updates import paths and adds "use client" directive where needed
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const filename = root.filename();
  const edits: Edit[] = [];

  // Skip if this is the main App.tsx file - it has its own transformation
  if (filename.includes("src/App.tsx")) {
    return null;
  }

  // 1. Update import paths to use @/src/ alias
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

  // 2. Add "use client" directive for components that need it
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
    rootNode.find({ rule: { pattern: "addEventListener($$$)" } }) ||
    rootNode.find({ rule: { pattern: "window.$$$" } }) ||
    rootNode.find({ rule: { pattern: "document.$$$" } });

  const hasUseClient = rootNode.find({
    rule: {
      kind: "string",
      regex: "use client"
    }
  });

  if (needsUseClient && !hasUseClient) {
    edits.push({
      startPos: 0,
      endPos: 0,
      insertedText: '"use client";\n\n'
    });
  }

  // Apply edits if any changes were made
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;