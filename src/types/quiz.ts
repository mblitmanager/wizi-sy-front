
export type QuestionType = 
  | 'question audio'
  | 'remplir le champ vide'
  | 'carte flash'
  | 'correspondance'
  | 'choix multiples'
  | 'rearrangement'
  | 'vrai/faux'
  | 'banque de mots';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  quizCount: number;
  colorClass: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  categorieId: string;
  niveau: string;
  questions: Question[];
  points: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  answers?: Answer[];
  blanks?: Blank[];
  wordbank?: WordBankItem[];
  flashcard?: Flashcard;
  matching?: MatchingItem[];
  audioUrl?: string;
  explication?: string;
  points?: number;
  astuce?: string;
  media_url?: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
  position?: number;
  reponse_correct?: boolean;
}

export interface Blank {
  id: string;
  text: string;
  position?: number;
  bankGroup?: string;
}

export interface WordBankItem {
  id: string;
  text: string;
  isCorrect: boolean;
  bankGroup: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
}

export interface QuizSubmission {
  quizId: number;
  answers: {
    questionId: number;
    answer: string;
    timeSpent: number;
  }[];
}

export interface QuizHistory {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuizStats {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  total_points: number;
  points_earned: number;
}
