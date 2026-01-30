import { LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/hooks/useNavigation";
import { NavSection } from "@/components/navigation/NavSection";
import { LoadingNav } from "@/components/navigation/LoadingNav";

interface MainNavProps {
  showBottomNav?: boolean;
  onItemClick?: () => void;
}

export default function MainNav({
  showBottomNav = false,
  onItemClick,
}: MainNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, isLoading, user } = useNavigation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Show loading state while user data is being fetched
  if (isLoading) {
    return <LoadingNav />;
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo et utilisateur */}
      {/* <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="Wizi Learn" className="h-10" />
        </div>

        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={toggleProfileMenu}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>
        )}

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-gray-200"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}

      {/* Navigation avec scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Main Navigation Sections */}
          {items.mainSections.map((section) => (
            <NavSection
              key={section.title}
              title={section.title}
              items={section.items}
              onItemClick={onItemClick}
            />
          ))}

          {/* Profile Navigation Section */}
          <NavSection
            title="Mon Profil"
            items={items.profile}
            onItemClick={onItemClick}
          />

          {/* Help Navigation Section */}
          <NavSection
            title="Aide & Information"
            items={items.help}
            onItemClick={onItemClick}
          />
        </div>
      </div>

      {/* User info in footer (optional) */}
      {user && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Connecté en tant que <span className="font-medium">{user.email}</span>
          </p>
        </div>
      )}
    </div>
  );
}
