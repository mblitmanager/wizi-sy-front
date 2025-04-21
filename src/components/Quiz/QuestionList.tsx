import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import QuestionForm from './QuestionForm';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Question {
  id: number;
  title: string;
  content: string;
  type: string;
  difficulty: string;
  category: string;
}

interface Response {
  id: number;
  content: string;
  isCorrect: boolean;
  questionId: number;
}

const QuestionList: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    },
  });

  const { data: responses = [], isLoading: isLoadingResponses } = useQuery<Response[]>({
    queryKey: ['responses'],
    queryFn: async () => {
      const response = await fetch('/api/responses');
      if (!response.ok) throw new Error('Failed to fetch responses');
      return response.json();
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: Omit<Question, 'id'>) => {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question créée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création de la question');
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (data: Question) => {
      const response = await fetch(`/api/questions/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update question');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
      toast.success('Question mise à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de la question');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete question');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setIsDeleteDialogOpen(false);
      toast.success('Question supprimée avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la question');
    },
  });

  const handleSubmit = (data: Omit<Question, 'id'>) => {
    if (selectedQuestion) {
      updateQuestionMutation.mutate({ ...data, id: selectedQuestion.id });
    } else {
      createQuestionMutation.mutate(data);
    }
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuestion) {
      deleteQuestionMutation.mutate(selectedQuestion.id);
    }
  };

  if (isLoadingQuestions || isLoadingResponses) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Liste des questions</TabsTrigger>
          <TabsTrigger value="create">
            {selectedQuestion ? 'Modifier la question' : 'Nouvelle question'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {questions?.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {question.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(question)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{question.content}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {question.type}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {question.difficulty}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {question.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="create">
          <QuestionForm
            initialData={selectedQuestion || undefined}
            onSubmit={handleSubmit}
            isLoading={
              createQuestionMutation.isPending || updateQuestionMutation.isPending
            }
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement
              la question et toutes ses réponses associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionList; 