# Guide d'intégration de l'Admin Panel

## Structure créée

### Dossiers
- `src/pages/admin/` - Pages d'administration
- `src/components/admin/` - Composants réutilisables
- `src/services/admin/` - Services API

### Composants réutilisables

#### 1. AdminLayout
Layout principal avec sidebar de navigation
```tsx
<AdminLayout>
  {/* Contenu de la page */}
</AdminLayout>
```

#### 2. TableAdmin
Tableau avec actions (CRUD)
```tsx
<TableAdmin
  columns={columns}
  data={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onDuplicate={handleDuplicate}
/>
```

#### 3. FormAdmin
Formulaire modal réutilisable
```tsx
<FormAdmin
  title="Ajouter un élément"
  fields={fields}
  values={formValues}
  onChange={handleChange}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

## Pages d'administration créées

### 1. Dashboard (`/admin/dashboard`)
- Vue d'ensemble des statistiques
- Cartes de statistiques (Stagiaires, Formations, Quiz, Achievements)
- Activité récente
- Liens rapides

### 2. Stagiaires (`/admin/stagiaires`)
- Liste des stagiaires avec recherche
- CRUD complet
- Activation/Désactivation
- Pagination

### 3. Formations (`/admin/formations`)
- Liste des formations
- CRUD avec duplication
- Catégorisation
- Statut actif/inactif

### 4. Quiz (`/admin/quiz`)
- Liste des quiz
- CRUD avec duplication
- Activation/Désactivation
- Export/Import

## Services API

Les services sont organisés par ressource :
- `AdminStagiaireAPI`
- `AdminQuizAPI`
- `AdminFormationAPI`
- `AdminCatalogueAPI`
- `AdminFormateurAPI`
- `AdminCommercialAPI`

Chaque service contient :
- `getAll(page, search)` - Récupérer avec pagination et recherche
- `getById(id)` - Récupérer un élément
- `create(data)` - Créer
- `update(id, data)` - Mettre à jour
- `delete(id)` - Supprimer
- Actions spécifiques (duplicate, enable, disable, etc.)

## Intégration dans le Router

Ajouter les routes admin dans `App.tsx` ou votre fichier de routes :

```tsx
import { adminRoutes } from "@/routes/adminRoutes";

const routes = [
  ...existingRoutes,
  ...adminRoutes,
];
```

## Prochaines étapes à développer

### Pages admin manquantes :
1. **Catalogue Formations** (`/admin/catalogue`)
   - CRUD + Duplication + PDF Download

2. **Formateurs** (`/admin/formateurs`)
   - Gestion complète des formateurs

3. **Commerciaux** (`/admin/commerciaux`)
   - Gestion des commerciaux

4. **Achievements** (`/admin/achievements`)
   - Gestion des badges/achievements

5. **Statistiques** (`/admin/stats`)
   - Statistiques avancées par formation, formateur, catalogue

6. **Paramètres** (`/admin/parametres`)
   - Configuration générale

### Fonctionnalités manquantes :
- [ ] Import/Export Excel pour Stagiaires
- [ ] Import/Export pour Quiz
- [ ] Import/Export pour Formateurs et Commerciaux
- [ ] Notifications et logs
- [ ] Gestion des rôles et permissions
- [ ] Audit trail

## Authentification

**À implémenter :** Middleware pour vérifier le rôle admin avant d'accéder à `/admin/*`

Exemple :
```tsx
const ProtectedAdminRoute = ({ children }) => {
  const user = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};
```

## Styles et Thème

L'interface utilise :
- Tailwind CSS pour le styling
- Components UI du projet (Button, Card, Table)
- Palette Wizi (Orange #FF6B35, Gris)

## Notes

- Tous les appels API incluent l'authentification via le token JWT
- Les messages de succès/erreur utilisent le toast `sonner`
- Les formulaires sont dynamiques et extensibles
- Les listes supportent la pagination et la recherche
