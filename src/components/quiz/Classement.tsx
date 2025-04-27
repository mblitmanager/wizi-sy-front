import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trophy, Award, Clock, BarChart2, User, Crown, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={stagiaireProfile?.user?.image || undefined} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{stagiaireProfile?.stagiaire?.prenom}</h1>
            <p className="text-muted-foreground">{stagiaireProfile?.user?.email}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8">Statistiques</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Quiz</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizStats?.totalQuizzes || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(quizStats?.averageScore || 0)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Totaux</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizStats?.totalPoints || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((quizStats?.averageTimeSpent || 0) / 60)} min
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onglets pour Classement et Historique */}
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
          <Card>
            <CardHeader>
              <CardTitle>Classement Global</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Stagiaire</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Quiz Completés</TableHead>
                    <TableHead>Score Moyen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalClassement?.map((item, index) => (
                    <TableRow 
                      key={item.stagiaire.id}
                      className={item.stagiaire.id === stagiaireProfile?.stagiaire?.id ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                          {index === 1 && <Crown className="h-5 w-5 text-gray-400" />}
                          {index === 2 && <Crown className="h-5 w-5 text-amber-700" />}
                          <span className="font-bold">{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.stagiaire.image || undefined} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.stagiaire.prenom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{item.totalPoints}</TableCell>
                      <TableCell>{item.quizCount}</TableCell>
                      <TableCell>{Math.round(item.averageScore)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Temps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizHistory?.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.quiz.title}</TableCell>
                      <TableCell>{quiz.quiz.category}</TableCell>
                      <TableCell>{quiz.score}%</TableCell>
                      <TableCell>
                        {format(new Date(quiz.completedAt), "PPP", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {Math.round(quiz.timeSpent / 60)} min
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 