export interface User {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  questions: Question[];
  category: 'creation' | 'internet' | 'langues' | 'bureautique';
}

export interface Question {
  id: string;
  text: string;
  type: string;
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  level: string;
  thumbnail: string;
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
