export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  quizCount?: number;
  colorClass?: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description?: string;
  niveau: string;
  points: number;
  categorie: string;
  categorieId: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points?: number;
  astuce?: string;
  explication?: string;
  audioUrl?: string;
  media_url?: string;
  answers?: Answer[];
  blanks?: Blank[];
  matching?: MatchingItem[];
  flashcard?: FlashCard;
  wordbank?: WordBankItem[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
  reponse_correct?: boolean;
  position?: number;
}

export interface Blank {
  id: string;
  text: string;
  position: number;
  bankGroup: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
  position?: number;
}

export interface FlashCard {
  front: string;
  back: string;
}

export type QuestionType = 
  | 'choix multiples'
  | 'vrai/faux'
  | 'remplir le champ vide'
  | 'rearrangement'
  | 'correspondance'
  | 'carte flash'
  | 'banque de mots'
  | 'question audio';

export interface QuizHistory {
  id: string;
  quizId: string;
  score: number;
  completedAt: string;
}

export interface QuizStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  completedQuizzes: number;
}

export interface WordBankItem {
  id: string;
  text: string;
  isCorrect?: boolean;
  bankGroup?: string;
}
