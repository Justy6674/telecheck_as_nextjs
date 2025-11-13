# Archive

This directory collects legacy assets from the original Vite codebase and the codemod workspace that were removed from the active Next.js application. They are excluded from builds and linting via `tsconfig.json` and `eslint.config.mjs`.

- `legacy-vite-app/`: Original Vite entrypoint (`App.tsx`, `main.tsx`, `index.css`) and the routed pages that predated the Next.js migration.
- `tools/telecheck-nextjs/`: The codemod workflow and scaffolding that was generated during migration experiments.

Retaining these files here keeps the history accessible without impacting the Next.js build.
