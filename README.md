# Wizi Learn — Front

Application React (Vite + TypeScript + Tailwind/shadcn) de la plateforme Wizi Learn :
espace stagiaire, formateur, commercial et administrateur.

## Démarrer

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build de production dans dist/
npm run test:e2e     # tests Playwright
```

Variables d'environnement (`.env`) :

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | URL de l'API Laravel (ex. `https://api.wizi-learn.com/api`) |
| `VITE_API_URL_MEDIA` | Base des fichiers publics (avatars, médias) |
| `VITE_FIREBASE_VAPID_KEY` | Clé VAPID pour les notifications push |

## Architecture

```
src/
  App.tsx                 providers : QueryClient → User → Notifications → UI → Router
  router/routes.tsx       table des routes (lazy) et gardes de rôle
  lib/api.ts              client HTTP unique (token, refresh, 401, timeout)
  lib/queryClient.ts      configuration React Query
  context/                UserContext (session), NotificationProvider
  hooks/queries/          données partagées entre pages (React Query)
  services/               appels API par domaine
  components/common/      PageLoader, FullScreenLoader, SectionSkeleton, RouteError
  utils/roles.ts          normalisation des rôles et page d'accueil par rôle
```

### Appels API

- Toujours passer par `api` de `@/lib/api` : il ajoute le token, le rafraîchit
  quand il expire et déconnecte proprement sur un 401. Ne pas créer d'autre
  instance axios, ne pas relire le token dans `localStorage`, ne pas utiliser
  `fetch` vers l'API.
- `unwrapList` / `unwrapData` normalisent les réponses Laravel (`[...]`, `{ data }`, `{ member }`).
- Les données affichées par plusieurs pages passent par un hook de
  `hooks/queries/` : le cache React Query évite de refaire les mêmes appels.
  Toujours réutiliser la clé existante pour un même endpoint.

### Session et rôles

- `useUser()` expose `user`, `token`, `role` (normalisé : `stagiaire`, `formateur`,
  `commercial`, `admin`), `isLoading` (vérification initiale uniquement), `login`, `logout`.
- Le profil est mis en cache localement : l'application s'affiche immédiatement
  au rechargement, puis `/me` revalide en arrière-plan.
- Les routes protégées utilisent `guard(<Page />, ROLES)` dans `router/routes.tsx`.

### Mise en page et chargements

- Les pages avec sidebar sont rendues dans la route « shell » : le `Layout` reste
  monté pendant la navigation, seul le contenu affiche un `PageLoader`.
  Une page peut encore s'envelopper dans `<Layout>` sans dupliquer le cadre.
- Règle des loaders :
  - `FullScreenLoader` : uniquement au démarrage ou pour une page sans Layout ;
  - `PageLoader` : chargement d'une page dans le cadre ;
  - `SectionSkeleton` / squelettes locaux : une section qui charge ses données ;
  - un bouton qui envoie une requête affiche son propre état (`disabled` + spinner).
- Afficher un état d'erreur quand une requête échoue, jamais un loader infini.

### Déploiement et cache

- Les fichiers de `dist/assets/` sont hashés et servis avec un cache d'un an (`.htaccess`).
- `public/service-worker.js` : réseau d'abord pour les pages, cache pour les
  fichiers hashés. Incrémenter `VERSION` pour purger les caches clients.
