import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  return {
    server: {
      host: true,
      port: 8000,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      manifest: true,
      rollupOptions: {
        output: {
          entryFileNames: `assets/index.js`,        // Pas de hash
          chunkFileNames: `assets/chunk-[name].js`, // Stable
          assetFileNames: `assets/[name].[ext]`,    // Pas de hash
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
    plugins: [react(), componentTagger()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
