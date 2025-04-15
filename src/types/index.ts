
// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  points: number;
  avatar?: string;
}

// Re-export from other type files
export type {
  Category,
  Quiz,
  QuizQuestion,
  QuizResult,
  UserProgress,
  Answer,
  QuestionAnswer,
  QuestionType,
  LeaderboardEntry
} from './quiz';

// Export types related to the API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
