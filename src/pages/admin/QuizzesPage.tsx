
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QuizzesPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const mockQuizzes = [
    { id: '1', title: 'Introduction à HTML', category: 'Développement Web', questions: 10, difficulty: 'débutant', status: 'published' },
    { id: '2', title: 'CSS Avancé', category: 'Développement Web', questions: 8, difficulty: 'intermédiaire', status: 'published' },
    { id: '3', title: 'SQL Basics', category: 'Bases de données', questions: 12, difficulty: 'débutant', status: 'draft' },
    { id: '4', title: 'JavaScript ES6+', category: 'Développement Web', questions: 15, difficulty: 'avancé', status: 'published' },
  ];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-nunito">Débutant</Badge>;
      case 'intermédiaire':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-nunito">Intermédiaire</Badge>;
      case 'avancé':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 font-nunito">Avancé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-montserrat">Gestion des Quiz</h1>
        <Button className="font-nunito">
          <Plus className="h-4 w-4 mr-2" /> Créer un quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Liste des Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Difficulté</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium font-nunito">{quiz.title}</TableCell>
                  <TableCell className="font-roboto">{quiz.category}</TableCell>
                  <TableCell className="font-roboto">{quiz.questions}</TableCell>
                  <TableCell>{getDifficultyBadge(quiz.difficulty)}</TableCell>
                  <TableCell>
                    <Badge variant={quiz.status === 'published' ? 'default' : 'secondary'} className="font-nunito">
                      {quiz.status === 'published' ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzesPage;
