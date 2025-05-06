
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, History } from "lucide-react";
import { GlobalRanking } from './GlobalRanking';
import { QuizHistory } from './QuizHistory';
import { QuizHistory as QuizHistoryType } from '@/types/quiz';

interface ClassementTabsProps {
  globalClassement: any[];
  quizHistory: QuizHistoryType[];
  currentUserId?: string;
}

export const ClassementTabs: React.FC<ClassementTabsProps> = ({ 
  globalClassement, 
  quizHistory,
  currentUserId
}) => {
  return (
    <Tabs defaultValue="classement" className="space-y-4">
      <TabsList>
        <TabsTrigger value="classement" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Classement
        </TabsTrigger>
        <TabsTrigger value="historique" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique
        </TabsTrigger>
      </TabsList>

      <TabsContent value="classement">
        <GlobalRanking ranking={globalClassement || []} currentUserId={currentUserId} />
      </TabsContent>

      <TabsContent value="historique">
        <QuizHistory history={quizHistory || []} loading={false} />
      </TabsContent>
    </Tabs>
  );
};
