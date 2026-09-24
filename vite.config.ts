import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

/** Copie le .htaccess (réécriture SPA + cache) dans dist/ pour le déploiement Apache. */
function copyHtaccess(): Plugin {
  return {
    name: "copy-htaccess",
    apply: "build",
    closeBundle() {
      const source = path.resolve(__dirname, ".htaccess");
      if (!fs.existsSync(source)) {
        console.warn("⚠️  .htaccess introuvable, copie ignorée.");
        return;
      }
      fs.mkdirSync(path.resolve(__dirname, "dist"), { recursive: true });
      fs.copyFileSync(source, path.resolve(__dirname, "dist", ".htaccess"));
    },
  };
}

/**
 * Dépendances chargées au démarrage, isolées dans leurs propres fichiers : elles changent
 * rarement, le navigateur les garde en cache d'un déploiement à l'autre.
 * Les librairies utilisées seulement par certaines pages (graphiques, MUI, animations)
 * sont laissées au découpage automatique : regroupées ici, elles aspireraient des
 * dépendances partagées (clsx, react-is...) et seraient chargées dès l'ouverture.
 */
const VENDOR_CHUNKS: Record<string, (pkg: string) => boolean> = {
  react: (pkg) => ["react", "react-dom", "react-router", "react-router-dom", "scheduler"].includes(pkg),
  query: (pkg) => pkg.startsWith("@tanstack/"),
  firebase: (pkg) => pkg === "firebase" || pkg.startsWith("@firebase/"),
};

/** Nom du package npm d'un module ("@scope/nom" ou "nom"). */
function packageName(id: string): string | undefined {
  const modulePath = id.split("node_modules/").pop();
  if (!modulePath || modulePath === id) return undefined;
  const [first, second] = modulePath.split("/");
  return first.startsWith("@") ? `${first}/${second}` : first;
}

function vendorChunk(id: string): string | undefined {
  const pkg = packageName(id);
  if (!pkg) return undefined;
  const chunk = Object.entries(VENDOR_CHUNKS).find(([, matches]) => matches(pkg));
  return chunk ? `vendor-${chunk[0]}` : undefined;
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger(), copyHtaccess()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      output: {
        // Noms hashés (défaut Vite) : cache long sans risque de servir une ancienne version
        manualChunks: vendorChunk,
      },
    },
  },
}));
