
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CoursesPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const mockCourses = [
    { id: '1', name: 'Développement Web', quizCount: 5, description: 'Apprentissage du développement web', status: 'published' },
    { id: '2', name: 'Bases de données', quizCount: 3, description: 'Introduction aux bases de données', status: 'published' },
    { id: '3', name: 'UX/UI Design', quizCount: 4, description: 'Principes du design d\'interface', status: 'draft' },
    { id: '4', name: 'Cybersécurité', quizCount: 6, description: 'Initiation à la sécurité informatique', status: 'published' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-montserrat">Gestion des Formations</h1>
        <Button className="font-nunito">
          <Plus className="h-4 w-4 mr-2" /> Ajouter une formation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Liste des Formations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium font-nunito">{course.name}</TableCell>
                  <TableCell className="font-roboto">{course.quizCount}</TableCell>
                  <TableCell className="font-roboto max-w-xs truncate">{course.description}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'published' ? 'success' : 'secondary'} className="font-nunito">
                      {course.status === 'published' ? 'Publié' : 'Brouillon'}
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

export default CoursesPage;
