import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    // Config de base pour dev/local
    return {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  // Config personnalisée pour production
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
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
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
