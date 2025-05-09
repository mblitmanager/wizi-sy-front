
import React from 'react';
import { User } from '@/types';
import { Category, QuizResult, UserProgress } from '@/types/quiz';
import UserStats from '@/components/profile/UserStats';
import { RecentResults } from '@/components/profile/RecentResults';
import CategoryProgress from '@/components/profile/CategoryProgress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Medal, FileText, Users, Award, Mail, Gift, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileTabsProps {
  user: User | null;
  results: QuizResult[];
  categories: Category[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  rankings: any[];
  activeTab: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  user, 
  results, 
  categories, 
  userProgress, 
  isLoading,
  rankings
}) => {
  // Transform rankings data to ensure we have all required properties with valid values
  const safeRankings = rankings.map((entry, index) => ({
    stagiaire: {
      id: entry?.stagiaire?.id || entry?.id?.toString() || `rank-${index}`,
      prenom: entry?.stagiaire?.prenom || entry?.prenom || 'Anonyme',
      image: null
    },
    totalPoints: entry?.totalPoints || entry?.points || 0,
    quizCount: entry?.quizCount || entry?.completed_quizzes || 0,
    averageScore: entry?.averageScore || entry?.average_score || 0,
    rang: entry?.rang || index + 1
  }));
  
  const featureLinks = [
    { 
      icon: BookOpen, 
      label: "Tous les Quiz", 
      to: "/quizzes",
      color: "bg-blue-100 text-blue-600"
    },
    { 
      icon: Medal, 
      label: "Classement", 
      to: "/classement",
      color: "bg-amber-100 text-amber-600"
    },
    { 
      icon: FileText, 
      label: "Mes Résultats", 
      to: "/results",
      color: "bg-green-100 text-green-600"
    },
    { 
      icon: Users, 
      label: "Contacts", 
      to: "/contacts",
      color: "bg-indigo-100 text-indigo-600"
    },
    { 
      icon: Gift, 
      label: "Parrainage", 
      to: "/parrainage",
      color: "bg-purple-100 text-purple-600"
    },
    { 
      icon: Award, 
      label: "Badges", 
      to: "/badges",
      color: "bg-pink-100 text-pink-600"
    },
    { 
      icon: Settings, 
      label: "Paramètres", 
      to: "/settings",
      color: "bg-gray-100 text-gray-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <UserStats user={user} userProgress={userProgress} />
          <motion.div
            className="mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-xl font-semibold mb-4">Accès rapide</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {featureLinks.map((link) => (
                <motion.div key={link.to} variants={itemVariants}>
                  <Link to={link.to}>
                    <Button 
                      variant="ghost" 
                      className={`w-full h-auto flex flex-col items-center justify-center p-3 ${link.color} border hover:bg-opacity-90 transition-all`}
                    >
                      <link.icon className="h-6 w-6 mb-2" />
                      <span className="text-xs font-medium text-center">{link.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Résultats récents</h3>
          <RecentResults results={results} isLoading={isLoading} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Progression par catégorie</h3>
        <CategoryProgress categories={categories} userProgress={userProgress} />
      </div>
    </div>
  );
};

export default ProfileTabs;
