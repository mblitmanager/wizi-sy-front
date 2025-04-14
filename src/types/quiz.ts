export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'ordering' | 'word_bank' | 'flashcard' | 'audio';
  options?: string[];
  correctAnswer: any;
  points: number;
  mediaUrl?: string;
  explanation?: string;
  hint?: string;
  timeLimit?: number;
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
  categoryId: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  trainingId?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

export interface QuizResponse {
  data: Quiz;
}

export interface QuizSubmitResponse {
  data: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    results: {
      questionId: string;
      isCorrect: boolean;
      correctAnswer: any;
    }[];
  };
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