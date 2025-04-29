import { User } from "./index";

export interface Question {
  id: string;
  text: string;
  type: string;
  media_url?: string;
  explication?: string;
  points: number;
  astuce?: string;
  quiz_id: string;
  created_at?: string;
  updated_at?: string;
  reponses: Answer[];
}

export interface Response {
  id: string;
  text: string;
  is_correct: boolean;
  question_id: string;
  created_at?: string;
  updated_at?: string;
  position?: number;
  match_pair?: string;
  bank_group?: string;
  flashcard_back?: string;
}

export interface Answer {
  id: number;
  text: string;
  is_correct: number;
  position: string | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  duree: number;
  niveau: string;
  nb_points_total: number;
  formation_id: string;
  questions: Question[];
  created_at?: string;
  updated_at?: string;
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
  quiz_id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed_at: string;
  time_spent: number;
  max_streak: number;
  mode: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  stagiaire_id: string;
  prenom: string;
  points: number;
  rank: number;
  completed_quizzes: number;
  average_score: number;
  last_activity: string;
}

export interface UserProgress {
  id: string;
  stagiaire_id: string;
  total_points: number;
  completed_quizzes: number;
  average_score: number;
  current_streak: number;
  longest_streak: number;
  last_quiz_date: string;
  category_progress: Record<string, {
    completed: number;
    total: number;
    average_score: number;
  }>;
}

export interface Formation {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image: string | null;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  formateurs: Formateur[];
  stagiaires: Stagiaire[];
  quizzes: Quiz[];
}

export interface Formateur {
  id: number;
  role: string;
  prenom: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  pivot: {
    formation_id: number;
    formateur_id: number;
  };
}

export interface Stagiaire {
  id: number;
  prenom: string;
  civilite: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  ville: string;
  code_postal: string;
  role: string;
  statut: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  pivot: {
    formation_id: number;
    stagiaire_id: number;
  };
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
