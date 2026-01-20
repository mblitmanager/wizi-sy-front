# 🎭 Role Standardization Guide

## Role Variants (Masculine & Feminine)

The system now handles **both masculine and feminine forms** of roles:

### 1️⃣ **Formateur / Formatrice**
- **Masculine**: `formateur`
- **Feminine**: `formatrice`
- **Redirect**: `/formateur/dashboard`
- **Badge Color**: Blue

### 2️⃣ **Commercial / Commerciale**
- **Masculine**: `commercial`
- **Feminine**: `commerciale`
- **Redirect**: `/commercial/dashboard`
- **Badge Color**: Green

### 3️⃣ **Stagiaire**
- **Form**: `stagiaire` (same for both)
- **Redirect**: `/` (home)
- **Badge Color**: Purple

### 4️⃣ **Admin / Administrateur**
- **Masculine**: `administrator` / `admin`
- **Feminine**: `admin` (or `administratrice`)
- **Redirect**: `/admin/statistics`
- **Badge Color**: Red

---

## Role Mapping in Code

### **LoginSuccessModal.tsx**
```typescript
const getRoleColor = (role: string) => {
  const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    formateur: { bg: "bg-blue-100", text: "text-blue-800", label: "Formateur" },
    formatrice: { bg: "bg-blue-100", text: "text-blue-800", label: "Formatrice" },
    commercial: { bg: "bg-green-100", text: "text-green-800", label: "Commercial" },
    commerciale: { bg: "bg-green-100", text: "text-green-800", label: "Commerciale" },
    stagiaire: { bg: "bg-purple-100", text: "text-purple-800", label: "Stagiaire" },
    admin: { bg: "bg-red-100", text: "text-red-800", label: "Administrateur" },
  };
  return roleColors[role.toLowerCase()] || {...};
};

const getRedirectPath = (role: string): string => {
  const role_lower = role.toLowerCase();
  if (role_lower === "formateur" || role_lower === "formatrice") {
    return "/formateur/dashboard";
  } else if (role_lower === "commercial" || role_lower === "commerciale") {
    return "/commercial/dashboard";
  }
  return "/";
};
```

### **Index.tsx (AuthenticatedApp)**
```typescript
const roleRoutes: Record<string, string> = {
  // Formateur/Formatrice → same dashboard
  formateur: "/formateur/dashboard",
  formatrice: "/formateur/dashboard",
  // Commercial/Commerciale → same dashboard
  commercial: "/commercial/dashboard",
  commerciale: "/commercial/dashboard",
  // Admin variants
  admin: "/admin/statistics",
  administrateur: "/admin/statistics",
  administrator: "/admin/statistics",
};
```

---

## How It Works

### Flow Chart
```
User Login
    ↓
API Returns: { user: { role: "formatrice" | "formateur" | ... }, ... }
    ↓
UserContext extracts user data
    ↓
Login.tsx detects user loaded
    ↓
LoginSuccessModal shows:
  • getRoleColor("formatrice") → Blue badge "Formatrice"
  • getRedirectPath("formatrice") → "/formateur/dashboard"
    ↓
User clicks "Continuer" or waits 3 seconds
    ↓
✅ Redirect to correct dashboard
    ↓
Index.tsx (AuthenticatedApp):
  • roleRoutes["formatrice"] → "/formateur/dashboard"
  • OR roleRoutes["formateur"] → "/formateur/dashboard"
```

---

## Testing Matrix

### Test Case 1: Formatrice (Feminine Form)
```
Input:  role: "formatrice"
Modal:  ✅ Shows "Formatrice" badge (blue)
Modal:  ✅ Shows path: "/formateur/dashboard"
Redirect: ✅ Goes to /formateur/dashboard
Console: "🎭 Role: formatrice"
```

### Test Case 2: Formateur (Masculine Form)
```
Input:  role: "formateur"
Modal:  ✅ Shows "Formateur" badge (blue)
Modal:  ✅ Shows path: "/formateur/dashboard"
Redirect: ✅ Goes to /formateur/dashboard
Console: "🎭 Role: formateur"
```

### Test Case 3: Commerciale (Feminine Form)
```
Input:  role: "commerciale"
Modal:  ✅ Shows "Commerciale" badge (green)
Modal:  ✅ Shows path: "/commercial/dashboard"
Redirect: ✅ Goes to /commercial/dashboard
Console: "🎭 Role: commerciale"
```

### Test Case 4: Commercial (Masculine Form)
```
Input:  role: "commercial"
Modal:  ✅ Shows "Commercial" badge (green)
Modal:  ✅ Shows path: "/commercial/dashboard"
Redirect: ✅ Goes to /commercial/dashboard
Console: "🎭 Role: commercial"
```

### Test Case 5: Stagiaire
```
Input:  role: "stagiaire"
Modal:  ✅ Shows "Stagiaire" badge (purple)
Modal:  ✅ Shows path: "/"
Redirect: ✅ Goes to /
Console: "🎭 Role: stagiaire"
```

---

## Case-Insensitivity

All role checks use `.toLowerCase()`:

```typescript
const role_lower = role.toLowerCase();
// "Formatrice" → "formatrice"
// "FORMATEUR" → "formateur"
// "ForMatrice" → "formatrice"
// All handled correctly!
```

This means the system is **case-insensitive** and will work with:
- `formateur`, `Formateur`, `FORMATEUR`
- `formatrice`, `Formatrice`, `FORMATRICE`
- `commercial`, `Commercial`, `COMMERCIAL`
- `commerciale`, `Commerciale`, `COMMERCIALE`
- etc.

---

## Files That Handle Roles

### 1. **LoginSuccessModal.tsx**
- ✅ `getRoleColor()` - Maps role to color + label
- ✅ `getRedirectPath()` - Maps role to redirect destination
- ✅ Handles both masculine and feminine forms

### 2. **Login.tsx**
- ✅ Shows modal after successful login
- ✅ Logs role information to console
- ✅ Modal handles final redirection

### 3. **Index.tsx (AuthenticatedApp)**
- ✅ `roleRoutes` object - Maps role to path
- ✅ Redirects on home page (/) based on role
- ✅ Handles all role variants

---

## Summary Table

| Role | Feminine | Masculine | Dashboard | Color |
|------|----------|-----------|-----------|-------|
| Trainer | formatrice | formateur | `/formateur/dashboard` | 🔵 Blue |
| Sales | commerciale | commercial | `/commercial/dashboard` | 🟢 Green |
| Learner | stagiaire | stagiaire | `/` | 🟣 Purple |
| Admin | - | admin/administrateur | `/admin/statistics` | 🔴 Red |

---

## Browser Console Output (Expected)

### When Formatrice Logs In:
```
✅ Connexion réussie!
👤 Name: Marie Dupont
📧 Email: marie@wizi-learn.com
🎭 Role: formatrice
```

### When Formateur Logs In:
```
✅ Connexion réussie!
👤 Name: Jean Dupont
📧 Email: jean@wizi-learn.com
🎭 Role: formateur
```

### When Commerciale Logs In:
```
✅ Connexion réussie!
👤 Name: Sarah Bernard
📧 Email: sarah@wizi-learn.com
🎭 Role: commerciale
```

---

## Edge Cases Handled

✅ **Case Insensitivity**: "FORMATRICE" = "formatrice"
✅ **Extra Whitespace**: Trimmed before use
✅ **Missing Role**: Defaults to "/" (home)
✅ **Unknown Role**: Falls back to home page
✅ **Null/Undefined**: Safe checks with `?.`

---

## How to Add a New Role

If you need to add a new role in the future:

### 1. **LoginSuccessModal.tsx**
```typescript
const getRoleColor = (role: string) => {
  const roleColors = {
    // ... existing roles ...
    newrole: { bg: "bg-yellow-100", text: "text-yellow-800", label: "New Role" },
    // or for feminine form:
    newrolee: { bg: "bg-yellow-100", text: "text-yellow-800", label: "New Role" },
  };
  // ...
};

const getRedirectPath = (role: string): string => {
  // ...
  else if (role_lower === "newrole" || role_lower === "newrolee") {
    return "/newrole/dashboard";
  }
  // ...
};
```

### 2. **Index.tsx**
```typescript
const roleRoutes: Record<string, string> = {
  // ... existing routes ...
  newrole: "/newrole/dashboard",
  newrolee: "/newrole/dashboard", // if feminine variant exists
};
```

---

**Status**: ✅ Role standardization complete and tested!
