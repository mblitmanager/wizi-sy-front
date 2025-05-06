
// Type declarations for question type components
declare module '@/components/quiz/question-types/AudioQuestion' {
  import { Question } from '@/types/quiz';
  
  interface AudioQuestionProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function AudioQuestion(props: AudioQuestionProps): JSX.Element;
}

declare module '@/components/quiz/question-types/MultipleChoice' {
  import { Question } from '@/types/quiz';
  
  interface MultipleChoiceProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function MultipleChoice(props: MultipleChoiceProps): JSX.Element;
}

declare module '@/components/quiz/question-types/TrueFalse' {
  import { Question } from '@/types/quiz';
  
  interface TrueFalseProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function TrueFalse(props: TrueFalseProps): JSX.Element;
}

declare module '@/components/quiz/question-types/FillBlank' {
  import { Question } from '@/types/quiz';
  
  interface FillBlankProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function FillBlank(props: FillBlankProps): JSX.Element;
}

declare module '@/components/quiz/question-types/Ordering' {
  import { Question } from '@/types/quiz';
  
  interface OrderingProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function Ordering(props: OrderingProps): JSX.Element;
}

declare module '@/components/quiz/question-types/WordBank' {
  import { Question } from '@/types/quiz';
  
  interface WordBankProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function WordBank(props: WordBankProps): JSX.Element;
}

declare module '@/components/quiz/question-types/Matching' {
  import { Question } from '@/types/quiz';
  
  interface MatchingProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function Matching(props: MatchingProps): JSX.Element;
}

declare module '@/components/quiz/question-types/FlashCard' {
  import { Question } from '@/types/quiz';
  
  interface FlashcardProps {
    question: Question;
    onAnswer: (answers: any) => void;
    showFeedback?: boolean;
  }
  
  export function Flashcard(props: FlashcardProps): JSX.Element;
}

declare module '@/components/quiz/classement/QuizHistory' {
  import { QuizHistory } from '@/types/quiz';
  
  export interface QuizHistoryProps {
    history: QuizHistory[];
    loading?: boolean;
  }
  
  export function QuizHistory(props: QuizHistoryProps): JSX.Element;
}
