import {
  Home,
  GraduationCap,
  Brain,
  Video,
  User,
  Trophy,
  Gift,
  X,
} from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";

import { useUser } from "@/context/UserContext";
import useAdvert from "../publiciter/useAdvert";
import { motion } from "framer-motion";

interface MainNavProps {
  showBottomNav?: boolean;
}

export default function MainNav({ showBottomNav = false }: MainNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const pathname = location.pathname;

  const { isVisible, message } = useAdvert("Je parraine et je gagne 50 € !");

  // Main navigation items
  const items = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
    },
    {
      title: "Quiz",
      href: "/quizzes",
      icon: Brain,
    },
    {
      title: "Classement",
      href: "/classement",
      icon: Trophy,
    },
    {
      title: "Parrainage",
      href: "/parrainage",
      icon: Gift,
    },
    {
      title: "Tutoriels",
      href: "/tuto-astuce",
      icon: Video,
    },
    {
      title: "Formations",
      href: "/catalogue",
      icon: GraduationCap,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const handleLogout = async () => {
    try {
      // 1. Nettoyage immédiat
      localStorage.removeItem("token");
      // 2. Déconnexion globale (si votre hook gère un état)
      if (logout) logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <ul className="space-y-1 p-3">
            {items.map((item) => (
              <li key={item.href} className="py-2">
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const baseClasses =
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-all";
                    const activeClasses = "bg-yellow-400 text-white shadow-md";
                    const inactiveClasses =
                      "text-gray-500 hover:bg-gray-100 hover:text-gray-800";

                    return `${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`;
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                      {item.title}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto px-3 py-4 border-t">
        <Link to="/parrainage" className="w-full">
          <motion.div
            initial={{ opacity: 0, x: -300 }} // Commence à gauche de l'écran (en dehors de l'écran)
            animate={{ opacity: 1, x: 0 }} // Anime vers la position originale
            exit={{ opacity: 0, x: -300 }} // Quitte vers la gauche
            transition={{ duration: 0.5 }}
            className=" w-[calc(100%-2rem)] bg-gradient-to-br  from-blue-custom-300 to-cyan-600 text-white p-1 mb-2 sm:p-4  flex items-center mx-auto  gap-3 z-50 cursor-pointer hover:shadow-xl transition-all"
          >
            <Gift className="w-8 h-8 " />
            <span className="font-semibold text-xs">
              Je parraine et je gagne{" "}
              <span className="text-black text-2xl">50€</span>
            </span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
