
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import { ProfileStats } from './classement/ProfileStats';
import { ClassementTabs } from './classement/ClassementTabs';

export const Classement: React.FC = () => {
  const { data: stagiaireProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["stagiaireProfile"],
    queryFn: () => quizSubmissionService.getStagiaireProfile(),
  });

  const { data: quizHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["quizHistory", stagiaireProfile?.stagiaire?.id],
    queryFn: () => quizSubmissionService.getQuizHistory(),
    enabled: !!stagiaireProfile?.stagiaire?.id
  });

  const { data: quizStats } = useQuery({
    queryKey: ["quizStats", stagiaireProfile?.stagiaire?.id],
    queryFn: () => quizSubmissionService.getQuizStats(),
    enabled: !!stagiaireProfile?.stagiaire?.id
  });

  const { data: globalClassement } = useQuery({
    queryKey: ["globalClassement"],
    queryFn: () => quizSubmissionService.getGlobalClassement(),
  });

  if (isLoadingProfile || isLoadingHistory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profil et Statistiques */}
      <ProfileStats stats={quizStats || { totalQuizzes: 0, totalScore: 0, completedQuizzes: 0, averageScore: 0, totalPoints: 0, averageTimeSpent: 0 }} profile={stagiaireProfile} />
      
      {/* Onglets pour Classement et Historique */}
      <ClassementTabs 
        globalClassement={globalClassement || []} 
        quizHistory={quizHistory || []}
        currentUserId={stagiaireProfile?.stagiaire?.id} 
      />
    </div>
  );
};
