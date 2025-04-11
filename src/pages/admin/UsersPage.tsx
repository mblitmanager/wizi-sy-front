
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';

const UsersPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const mockUsers = [
    { id: '1', username: 'Thomas', email: 'thomas@example.com', level: 2, lastActive: '2025-04-10' },
    { id: '2', username: 'Marie', email: 'marie@example.com', level: 4, lastActive: '2025-04-11' },
    { id: '3', username: 'Julien', email: 'julien@example.com', level: 1, lastActive: '2025-04-09' },
    { id: '4', username: 'Sophie', email: 'sophie@example.com', level: 3, lastActive: '2025-04-08' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-montserrat">Gestion des Utilisateurs</h1>
        <Button className="font-nunito">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Liste des Stagiaires</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium font-nunito">{user.username}</TableCell>
                  <TableCell className="font-roboto">{user.email}</TableCell>
                  <TableCell className="font-roboto">{user.level}</TableCell>
                  <TableCell className="font-roboto">{user.lastActive}</TableCell>
                  <TableCell className="text-right">
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

export default UsersPage;
