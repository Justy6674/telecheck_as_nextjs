import type { SgRoot, SgNode, Edit } from "@codemod.com/jssg-types/main";

type TSX = any; // Type will be resolved at runtime

/**
 * Transforms Vite-specific imports to Next.js compatible imports
 */
async function transform(root: SgRoot<TSX>): Promise<string | null> {
  const rootNode = root.root();
  const edits: Edit[] = [];

  // 1. Transform import.meta.env to process.env
  const metaEnvRefs = rootNode.findAll({
    rule: { pattern: "import.meta.env.$VAR" }
  });

  metaEnvRefs.forEach(ref => {
    const varName = ref.getMatch("VAR");
    if (varName) {
      const envVarName = varName.text();
      // Next.js requires NEXT_PUBLIC_ prefix for client-side env vars
      if (!envVarName.startsWith("NEXT_PUBLIC_")) {
        edits.push(ref.replace(`process.env.NEXT_PUBLIC_${envVarName}`));
      } else {
        edits.push(ref.replace(`process.env.${envVarName}`));
      }
    }
  });

  // 2. Transform import.meta.url
  const metaUrlRefs = rootNode.findAll({
    rule: { pattern: "import.meta.url" }
  });

  metaUrlRefs.forEach(ref => {
    // In Next.js, we typically don't need import.meta.url
    // Replace with appropriate Next.js pattern based on context
    edits.push(ref.replace("typeof window !== 'undefined' ? window.location.href : ''"));
  });

  // 3. Transform CSS imports to CSS modules (for non-global styles)
  const cssImports = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'import "$PATH.css"' },
        { pattern: "import '$PATH.css'" }
      ]
    }
  });

  cssImports.forEach(imp => {
    const pathMatch = imp.text().match(/['"](.+\.css)['"]/);
    if (pathMatch) {
      const cssPath = pathMatch[1];
      // Skip global styles and index.css
      if (!cssPath.includes("global") && !cssPath.includes("index.css")) {
        const modulePath = cssPath.replace(".css", ".module.css");
        const varName = cssPath.split("/").pop()?.replace(".css", "").replace(/-/g, "_");
        edits.push(imp.replace(`import styles from "${modulePath}"`));
      }
    }
  });

  // 4. Transform image imports
  const imageImports = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'import $VAR from "$PATH"' },
        { pattern: "import $VAR from '$PATH'" }
      ]
    }
  });

  imageImports.forEach(imp => {
    const pathMatch = imp.text().match(/from ['"](.+\.(png|jpg|jpeg|gif|svg|webp|ico))['"]/i);
    if (pathMatch) {
      const imagePath = pathMatch[1];
      const varName = imp.getMatch("VAR");
      if (varName) {
        // Transform to Next.js Image import pattern
        const publicPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

        // Add Next.js Image import if not present
        const hasImageImport = rootNode.find({
          rule: { pattern: 'import Image from "next/image"' }
        });

        if (!hasImageImport) {
          edits.push({
            startPos: 0,
            endPos: 0,
            insertedText: 'import Image from "next/image";\n'
          });
        }

        // Replace with static import for Next.js
        edits.push(imp.replace(`import ${varName.text()} from "@/public${publicPath}"`));
      }
    }
  });

  // 5. Transform Vite-specific imports (like ?raw, ?url)
  const viteSpecificImports = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'import $VAR from "$PATH?raw"' },
        { pattern: 'import $VAR from "$PATH?url"' },
        { pattern: "import $VAR from '$PATH?raw'" },
        { pattern: "import $VAR from '$PATH?url'" }
      ]
    }
  });

  viteSpecificImports.forEach(imp => {
    const varName = imp.getMatch("VAR");
    const pathMatch = imp.text().match(/from ['"](.+)\?(raw|url)['"]/);

    if (varName && pathMatch) {
      const filePath = pathMatch[1];
      const importType = pathMatch[2];

      if (importType === "raw") {
        // For raw imports, use fs.readFileSync in getStaticProps/getServerSideProps
        edits.push(imp.replace(`// TODO: Move to getStaticProps/getServerSideProps\n// const ${varName.text()} = fs.readFileSync("${filePath}", "utf-8")`));
      } else if (importType === "url") {
        // For URL imports, use public directory
        edits.push(imp.replace(`const ${varName.text()} = "/${filePath}"`));
      }
    }
  });

  // 6. Update alias imports to ensure consistency
  const aliasImports = rootNode.findAll({
    rule: {
      any: [
        { pattern: 'import $$$ANY from "@/$PATH"' },
        { pattern: "import $$$ANY from '@/$PATH'" }
      ]
    }
  });

  // Verify alias imports are correctly formatted (no changes needed if already using @/)

  // 7. Add "use client" directive for client components
  const hasClientFeatures =
    rootNode.find({ rule: { pattern: "useState($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useEffect($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useReducer($$$)" } }) ||
    rootNode.find({ rule: { pattern: "useContext($$$)" } }) ||
    rootNode.find({ rule: { pattern: "onClick={$$$}" } }) ||
    rootNode.find({ rule: { pattern: "onChange={$$$}" } });

  if (hasClientFeatures) {
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
  }

  // Apply edits if any changes were made
  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
}

export default transform;