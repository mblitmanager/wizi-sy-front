
import React from 'react';
import { User } from '@/types';
import { UserProgress } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Award, Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
}

const UserStats: React.FC<UserStatsProps> = ({ user, userProgress }) => {
  // Use total_points from userProgress (the correct property name according to the type)
  const totalPoints = user?.points || (userProgress?.total_points || 0);
  
  // Since badges and streak may not exist in the updated UserProgress, we'll provide fallbacks
  const badgesCount = 0; // Default to 0 since badges are not in our updated UserProgress
  const streak = userProgress?.current_streak || 0;
  const level = user?.level || 1;

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const iconVariants = {
    hover: { 
      scale: 1.2, 
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4 font-montserrat">Mes statistiques</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
        >
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <motion.div whileHover="hover" variants={iconVariants}>
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              </motion.div>
              <div className="text-2xl font-bold font-nunito">{totalPoints}</div>
              <div className="text-sm text-gray-600 font-roboto">Points</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
        >
          <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <motion.div whileHover="hover" variants={iconVariants}>
                <Award className="h-8 w-8 text-blue-500 mb-2" />
              </motion.div>
              <div className="text-2xl font-bold font-nunito">{level}</div>
              <div className="text-sm text-gray-600 font-roboto">Niveau</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
        >
          <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <motion.div whileHover="hover" variants={iconVariants}>
                <Flame className="h-8 w-8 text-red-500 mb-2" />
              </motion.div>
              <div className="text-2xl font-bold font-nunito">{streak}</div>
              <div className="text-sm text-gray-600 font-roboto">Jours consécutifs</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
        >
          <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <motion.div whileHover="hover" variants={iconVariants}>
                <Star className="h-8 w-8 text-purple-500 mb-2" />
              </motion.div>
              <div className="text-2xl font-bold font-nunito">{badgesCount}</div>
              <div className="text-sm text-gray-600 font-roboto">Badges</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default UserStats;
