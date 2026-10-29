// Bundles film/stage.ts (and three.js) into one script the film composition loads from file://.
export default {
  logLevel: "warn",
  build: {
    outDir: "film/.build",
    emptyOutDir: false,
    lib: { entry: "film/stage.ts", formats: ["iife"], name: "Stage", fileName: () => "stage.js" },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
};
