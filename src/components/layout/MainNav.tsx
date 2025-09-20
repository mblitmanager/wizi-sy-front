import {
  Home,
  GraduationCap,
  Brain,
  Video,
  User,
  Trophy,
  Gift,
} from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface MainNavProps {
  showBottomNav?: boolean;
  onItemClick?: () => void;
}

export default function MainNav({
  showBottomNav = false,
  onItemClick,
}: MainNavProps) {
  const navigate = useNavigate();
  const { logout } = useUser();

  // Main navigation items with additional metadata for animations
  const navItems = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
      color: "text-amber-500",
    },
    {
      title: "Quiz",
      href: "/quizzes",
      icon: Brain,
      color: "text-amber-500",
    },
    {
      title: "Classement",
      href: "/classement",
      icon: Trophy,
      color: "text-amber-500",
    },
    {
      title: "Parrainage",
      href: "/parrainage",
      icon: Gift,
      color: "text-amber-500",
    },
    {
      title: "Tutoriels",
      href: "/tuto-astuce",
      icon: Video,
      color: "text-amber-500",
    },
    {
      title: "Formations",
      href: "/catalogue",
      icon: GraduationCap,
      color: "text-amber-500",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      color: "text-amber-500",
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      if (logout) logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm border-r border-gray-100">
      {/* Navigation Items */}
      <div className="flex-1 space-y-1 px-3 py-2">
        <motion.ul
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}>
          {navItems.map((item, index) => (
            <motion.li
              key={item.href}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  },
                },
              }}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#f27905] to-yellow-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <motion.span
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-lg ${
                        isActive ? "bg-white/20" : "bg-gray-100"
                      }`}>
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : item.color
                        }`}
                      />
                    </motion.span>
                    <motion.span
                      animate={{
                        x: isActive ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}>
                      {item.title}
                    </motion.span>
                    {isActive && (
                      <motion.span
                        layoutId="navActiveIndicator"
                        className="absolute right-4 w-2 h-2 bg-white rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Promo Banner */}
      <AnimatePresence>
        <motion.div
          className="px-3 pb-6 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <Link to="/parrainage" className="block w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-3 flex items-center gap-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-noise opacity-10" />
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }}
                className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Je parraine et je gagne
                </p>
                <p className="text-lg font-bold text-white">50€</p>
              </div>
              <motion.div
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="text-white">
                →
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
