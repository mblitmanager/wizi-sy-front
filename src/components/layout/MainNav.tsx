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

import { useUser } from "@/hooks/useAuth";
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
      title: "Profil",
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
    <div className="flex flex-col h-full  border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2 ">
          <ul className="space-y-1 p-3">
            {items.map((item) => (
              <li key={item.href} className="py-1">
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const baseClasses =
                      "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-full transition-all";
                    const activeClasses =
                      "bg-yellow-shade hover:bg-yellow-shade-1  text-white shadow-md";
                    const inactiveClasses =
                      "text-gray-500 hover:bg-yellow-shade-1";

                    return `${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`;
                  }}>
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-500 "
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
      <div className="mt-auto  border-t bg-gradient-to-br from-yellow-shade-2 via-yellow-shade to-yellow-shade-2">
        <Link to="/parrainage" className="w-full">
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className=" bg-gradient-to-br w-full rounded-2xl text-white sm:p-2 flex items-center mx-auto gap-2 z-50 cursor-pointer hover:shadow-xl transition-all">
            <Gift className="w-10 h-10 flex-shrink-0" />
            <span className="font-semibold text-brown-shade text-xs">
              Je parraine et je gagne{" "}
              <span className="text-2xl text-white font-extrabold drop-shadow-lg">
                50€
              </span>{" "}
            </span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
