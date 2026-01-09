import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStagiaires from "@/pages/admin/Stagiaires";
import AdminFormations from "@/pages/admin/Formations";
import AdminQuiz from "@/pages/admin/Quiz";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/stagiaires",
    element: <AdminStagiaires />,
  },
  {
    path: "/admin/formations",
    element: <AdminFormations />,
  },
  {
    path: "/admin/quiz",
    element: <AdminQuiz />,
  },
  // TODO: Add more admin routes
  // - /admin/catalogue (Catalogue Formations)
  // - /admin/formateurs (Formateurs)
  // - /admin/commerciaux (Commerciaux)
  // - /admin/achievements (Achievements)
  // - /admin/stats (Statistiques)
  // - /admin/parametres (Paramètres)
];
