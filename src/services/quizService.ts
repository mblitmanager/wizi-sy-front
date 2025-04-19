import { api } from "@/lib/api";
import { Formation, Question, Quiz, Reponse } from "@/types";
import { QuizResult } from "@/types/quiz";

class QuizService {
  async getFormations(): Promise<Formation[]> {
    const response = await api.get<Formation[]>("/stagiaire/formations");
    return response.data;
  }

  async getQuizCategories(): Promise<string[]> {
    const formations = await this.getFormations();
    return [...new Set(formations.map(formation => formation.categorie))];
  }

  async getQuizByCategory(category: string): Promise<Quiz[]> {
    const formations = await this.getFormations();
    return formations
      .filter(formation => formation.categorie === category)
      .flatMap(formation => formation.quizzes);
  }

  async getQuizById(quizId: number): Promise<Quiz | undefined> {
    const formations = await this.getFormations();
    return formations
      .flatMap(formation => formation.quizzes)
      .find(quiz => quiz.id === quizId);
  }

  async getQuizQuestions(quizId: number): Promise<Question[]> {
    const quiz = await this.getQuizById(quizId);
    return quiz?.questions || [];
  }

  async getQuizAnswers(questionId: number): Promise<Reponse[]> {
    const response = await api.get<Reponse[]>(`/quiz/questions/${questionId}/answers`);
    return response.data;
  }

  async getFormationQuizzes(formationId: number): Promise<Quiz[]> {
    const formation = (await this.getFormations()).find(f => f.id === formationId);
    return formation?.quizzes || [];
  }

  async getQuizResults(quizId: number): Promise<QuizResult[]> {
    const response = await api.get<QuizResult[]>(`/quiz/${quizId}/results`);
    return response.data;
  }
}

export const quizService = new QuizService(); 
