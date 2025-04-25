
import apiClient from '@/lib/api-client';
import type { Quiz, Question, QuizHistory, QuizStats } from '@/types/quiz';
import { categoryService } from './CategoryService';

class QuizManagementService {
  private async formatQuiz(quiz: any, categories?: any[]) {
    if (!categories) {
      categories = await categoryService.getCategories();
    }
    
    let categorieId = '';
    let categorie = '';
    
    const titre = (quiz.titre || quiz.title || '').toLowerCase();
    if (titre.includes('excel') || titre.includes('bureautique')) {
      const bureautique = categories.find(c => c.name.toLowerCase() === 'bureautique');
      if (bureautique) {
        categorieId = bureautique.id;
        categorie = bureautique.name;
      }
    } else if (titre.includes('anglais') || titre.includes('français') || titre.includes('langues')) {
      const langues = categories.find(c => c.name.toLowerCase() === 'langues');
      if (langues) {
        categorieId = langues.id;
        categorie = langues.name;
      }
    }

    return {
      id: quiz.id,
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.categorie || quiz.category || categorie,
      categorieId: quiz.categorieId || quiz.category_id || quiz.categoryId || categorieId,
      niveau: quiz.niveau || quiz.level || '',
      questions: this.formatQuestions(quiz.questions || []),
      points: quiz.points || 0
    };
  }

  private formatQuestions(questions: any[]): Question[] {
    return questions.map(question => ({
      ...question,
      type: this.mapQuestionType(question.type),
      audioUrl: question.media_url || question.audioUrl,
      explication: question.explication || '',
      points: question.points || 0,
      astuce: question.astuce || '',
      answers: question.answers?.map((answer: any) => ({
        ...answer,
        isCorrect: answer.reponse_correct || answer.isCorrect
      }))
    }));
  }

  private mapQuestionType(type: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      'multiple-choice': 'choix multiples',
      'true-false': 'vrai/faux',
      'fill-in-blank': 'remplir le champ vide',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'flash-card': 'carte flash',
      'word-bank': 'banque de mots',
      'audio-question': 'question audio'
    };
    return typeMap[type] || type as Question['type'];
  }

  async getQuizzesByCategory(categoryId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get(`/quiz/category/${categoryId}`);
      const quizzes = response.data || [];
      const categories = await categoryService.getCategories();
      
      return Promise.all(quizzes.map(quiz => this.formatQuiz(quiz, categories)));
    } catch (error) {
      console.error('Error fetching quizzes by category:', error);
      return [];
    }
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}`);
      return await this.formatQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getQuizHistory(): Promise<QuizHistory[]> {
    try {
      const response = await apiClient.get('/quiz/history');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiClient.get('/quiz/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }
}

export const quizManagementService = new QuizManagementService();
