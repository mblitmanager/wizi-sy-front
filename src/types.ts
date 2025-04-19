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

export interface Quiz {
  id: number;
  titre: string;
  description: string;
  duree: string;
  niveau: string;
  nb_points_total: string;
  formation_id: number;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: string;
  explication: string | null;
  points: string;
  astuce: string | null;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  reponses: Reponse[];
}

export interface Reponse {
  id: number;
  text: string;
  is_correct: number;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
  created_at: string | null;
  updated_at: string | null;
} 