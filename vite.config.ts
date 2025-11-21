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
      optimizeDeps: {
        include: [
          "react",
          "react-dom",
          "react-router-dom",
          "@tanstack/react-query",
        ],
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
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: `assets/index.js`,
          chunkFileNames: `assets/chunk-[name].js`,
          assetFileNames: `assets/[name].[ext]`,
          manualChunks: (id) => {
            // React core
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
              return "vendor-react";
            }

            // Material UI (large library)
            if (id.includes("node_modules/@mui") || id.includes("node_modules/@emotion")) {
              return "vendor-mui";
            }

            // React Query
            if (id.includes("node_modules/@tanstack/react-query")) {
              return "vendor-react-query";
            }

            // Charts
            if (id.includes("node_modules/chart.js") || id.includes("node_modules/react-chartjs-2")) {
              return "vendor-charts";
            }

            // Icons
            if (id.includes("node_modules/lucide-react") || id.includes("node_modules/@mui/icons-material")) {
              return "vendor-icons";
            }

            // Animations
            if (id.includes("node_modules/framer-motion")) {
              return "vendor-animations";
            }

            // Radix UI components
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }

            // Firebase
            if (id.includes("node_modules/firebase")) {
              return "vendor-firebase";
            }

            // Other node_modules
            if (id.includes("node_modules")) {
              return "vendor-others";
            }
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
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
      ],
    },
  };
});
