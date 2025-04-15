
// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  points: number;
  avatar?: string;
  name?: string;
}

// Re-export all types from other type files
export type {
  Answer,
  Category,
  Formation,
  Question,
  QuestionType,
  QuestionAnswer,
  QuizResult,
  UserProgress,
  LeaderboardEntry,
  Quiz
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
