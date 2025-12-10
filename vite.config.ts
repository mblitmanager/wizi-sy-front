import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

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
    plugins: [
      react(),
      componentTagger(),
      // Plugin pour copier .htaccess dans dist
      {
        name: 'copy-htaccess',
        closeBundle() {
          const htaccessPath = path.resolve(__dirname, '.htaccess');
          const distPath = path.resolve(__dirname, 'dist', '.htaccess');

          if (!fs.existsSync(htaccessPath)) {
            console.warn('⚠️  .htaccess not found, skipping copy.');
            return;
          }

          // Crée dist/ si absent
          const distDir = path.dirname(distPath);
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }

          fs.copyFileSync(htaccessPath, distPath);
          console.log('✅ .htaccess copied to dist/');
        }
      }

    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
