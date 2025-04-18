import { User } from "./index";

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  media?: {
    type: "image" | "video" | "audio";
    url: string;
  };
  type:
    | "vrai faux"
    | "choix multiples"
    | "remplir le champ vide"
    | "correspondance"
    | "commander"
    | "banque de mots"
    | "carte flash"
    | "question audio";
  media_url?: string;
  explication?: string;
  points: number;
  astuce?: string;
  options?: string[];
  categories?: string[];
  correct_answer:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | Record<string, string>
    | Record<string, string[]>
    | Record<string, number[]>;
  time_limit?: number;
}

export interface Answer {
  id: string;
  text: string;
  is_correct: number;
  question_id?: string;
  match_pair?: string;
  bank_group?: string;
  flashcard_back?: string;
}

export interface Quiz {
  id: string;
  title: string;
  titre?: string;
  description: string;
  category: string;
  categoryId?: string;
  level?: "débutant" | "intermédiaire" | "avancé" | "super";
  niveau?: "débutant" | "intermédiaire" | "avancé" | "super";
  questions: Question[];
  points: number;
  nb_points_total?: number;
  timeLimit?: number;
}

export interface QuizSubmitData {
  quizId: string;
  answers: Record<string, string>;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  pointsEarned: number;
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
      correctAnswer:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | Record<string, string>
        | Record<string, string[]>
        | Record<string, number[]>;
    }[];
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  colorClass?: string;
  quizCount?: number;
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
  quizName?: string;
  answers?: Record<string, string>;
}

export interface UserProgress {
  quizzes_completed: number;
  total_points: number;
  average_score: number;
  categoryProgress?: Record<string, number>;
  points?: number;
  badges?: string[];
  streak?: number;
  stagiaire?: {
    id: number;
  };
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar?: string;
  total_points: number;
  quizzes_completed: number;
  average_score?: number;
  rank?: number;
}

export interface Formation {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image?: string;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  formateurs: User[];
  stagiaires: User[];
  quizzes: Quiz[];
}

type MultipleChoiceAnswer = number;
type TrueFalseAnswer = number;
type FillBlankAnswer = { [key: string]: string };
type MatchingAnswer = number[];
type OrderingAnswer = number[];
type WordBankAnswer = { [key: string]: string[] };
type FlashcardAnswer = boolean;
type AudioQuestionAnswer = string;

export type QuestionAnswer =
  | MultipleChoiceAnswer
  | TrueFalseAnswer
  | FillBlankAnswer
  | MatchingAnswer
  | OrderingAnswer
  | WordBankAnswer
  | FlashcardAnswer
  | AudioQuestionAnswer;
