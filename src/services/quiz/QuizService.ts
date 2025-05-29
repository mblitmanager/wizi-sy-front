import { api } from "@/lib/api";

export interface QuizStats {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  category_stats: {
    [key: string]: {
      total: number;
      completed: number;
      average_score: number;
    };
  };
}

export interface CategoryStats {
  category_id: string;
  category_name: string;
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  success_rate: number;
  last_activity: string;
}

export interface ProgressStats {
  daily_progress: {
    date: string;
    completed_quizzes: number;
    average_score: number;
  }[];
  weekly_progress: {
    week: string;
    completed_quizzes: number;
    average_score: number;
  }[];
  monthly_progress: {
    month: string;
    completed_quizzes: number;
    average_score: number;
  }[];
}

export interface QuizTrends {
  category_trends: {
    category_id: string;
    category_name: string;
    trend_data: {
      date: string;
      score: number;
    }[];
  }[];
  overall_trend: {
    date: string;
    average_score: number;
  }[];
}

export interface PerformanceStats {
  strengths: {
    category_id: string;
    category_name: string;
    score: number;
  }[];
  weaknesses: {
    category_id: string;
    category_name: string;
    score: number;
  }[];
  improvement_areas: {
    category_id: string;
    category_name: string;
    current_score: number;
    target_score: number;
  }[];
}

class QuizService {
  async getQuizStats(): Promise<QuizStats> {
    const response = await api.get('/quiz/stats');
    return response.data;
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    const response = await api.get('/quiz/stats/categories');
    return response.data;
  }

  async getProgressStats(): Promise<ProgressStats> {
    const response = await api.get('/quiz/stats/progress');
    return response.data;
  }

  async getQuizTrends(): Promise<QuizTrends> {
    const response = await api.get('/quiz/stats/trends');
    return response.data;
  }

  async getPerformanceStats(): Promise<PerformanceStats> {
    const response = await api.get('/quiz/stats/performance');
    return response.data;
  }

  async getQuizHistory() {
    const response = await api.get('/quiz/history');
    return response.data;
  }

  async getQuizStatistics(quizId: string) {
    const response = await api.get(`/quiz/${quizId}/statistics`);
    return response.data;
  }
}

export const quizService = new QuizService(); 