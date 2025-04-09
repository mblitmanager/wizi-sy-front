
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  quizCount: number;
  colorClass: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  questions: Question[];
  points: number;
  timeLimit?: number; // in seconds
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number; // in seconds
}

export interface UserProgress {
  userId: string;
  categoryProgress: {
    [categoryId: string]: {
      completedQuizzes: number;
      totalQuizzes: number;
      points: number;
    }
  };
  badges: string[];
  streak: number;
  lastActive: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: number;
  avatar?: string;
  rank: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
