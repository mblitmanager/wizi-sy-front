export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  type: 'true_false' | 'multiple_choice' | 'fill_blank' | 'matching' | 'ordering' | 'word_bank' | 'flashcard' | 'audio';
  media_url?: string;
  explication?: string;
  points: number;
  astuce?: string;
  options?: string[];
  correct_answer: any;
  time_limit?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  position?: number;
  match_pair?: string;
  bank_group?: string;
  flashcard_back?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  questions: Question[];
  time_limit?: number;
  passing_score?: number;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  completed_at: string;
  answers: {
    question_id: string;
    answer: any;
    is_correct: boolean;
  }[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface UserProgress {
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
  attempts: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
} 