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
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  questions: Question[];
  category: 'creation' | 'internet' | 'languages' | 'office';
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