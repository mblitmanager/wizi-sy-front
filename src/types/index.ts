export interface User {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
  currentFormation?: Formation;
  points: number;
  referralCode?: string;
  avatarUrl?: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  category: 'creation' | 'internet' | 'languages' | 'office';
  duration: number;
  level: string;
  thumbnailUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  questionCount: number;
  category: 'creation' | 'internet' | 'languages' | 'office';
  isDemo: boolean;
  continueOnError: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  maxScore: number;
  completed: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  type: 'trainer' | 'commercial' | 'support';
  user: User;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  trainerId: string;
}

export interface Media {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'image';
  url: string;
  formationId: string;
  duration?: number;
}