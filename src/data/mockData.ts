
import { AgendaEvent, Category, Challenge, Formation, Notification, Quiz, Ranking, User } from "@/types";

export const currentUser: User = {
  id: "user1",
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
  avatar: "https://i.pravatar.cc/150?u=user1",
  progress: {
    totalPoints: 2580,
    completedQuizzes: 32,
    streak: 5,
    level: 8
  }
};

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Bureautique",
    slug: "bureautique",
    color: "#3D9BE9",
    icon: "file-text",
    description: "Maîtrisez les outils bureautiques essentiels pour votre productivité professionnelle.",
    formations: []
  },
  {
    id: "cat2",
    name: "Langues",
    slug: "langues",
    color: "#A55E6E",
    icon: "message-square",
    description: "Améliorez vos compétences linguistiques avec nos formations interactives.",
    formations: []
  },
  {
    id: "cat3",
    name: "Internet",
    slug: "internet",
    color: "#FFC533",
    icon: "globe",
    description: "Découvrez les outils web et apprenez à développer votre présence en ligne.",
    formations: []
  },
  {
    id: "cat4",
    name: "Création",
    slug: "creation",
    color: "#9392BE",
    icon: "pen-tool",
    description: "Exprimez votre créativité avec nos formations sur les logiciels de création.",
    formations: []
  }
  ,
  {
    id: "cat5",
    name: "IA",
    slug: "IA",
    color: "#ABDA96",
    icon: "brain",
    description: "Création de contenus rédactionnels et visuels à l'aide de l'intelligence artificielle générative.",
    formations: []
  }
];

export const formations: Formation[] = [
  {
    id: "form1",
    name: "Word Essentiel",
    slug: "word-essentiel",
    categoryId: "cat1",
    description: "Maîtrisez les fonctionnalités essentielles de Microsoft Word.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    quizzes: [],
    totalQuizzes: 12,
    completedQuizzes: 8
  },
  {
    id: "form2",
    name: "Excel Avancé",
    slug: "excel-avance",
    categoryId: "cat1",
    description: "Apprenez les fonctionnalités avancées d'Excel pour l'analyse de données.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    quizzes: [],
    totalQuizzes: 15,
    completedQuizzes: 5
  },
  {
    id: "form3",
    name: "Français Intermédiaire",
    slug: "francais-intermediaire",
    categoryId: "cat2",
    description: "Perfectionnez votre français à l'écrit et à l'oral.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    quizzes: [],
    totalQuizzes: 20,
    completedQuizzes: 12
  },
  {
    id: "form4",
    name: "WordPress Base",
    slug: "wordpress-base",
    categoryId: "cat3",
    description: "Créez votre premier site web avec WordPress.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    quizzes: [],
    totalQuizzes: 10,
    completedQuizzes: 7
  },
  {
    id: "form5",
    name: "Photoshop Initiation",
    slug: "photoshop-initiation",
    categoryId: "cat4",
    description: "Découvrez les bases de la retouche photo avec Photoshop.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    quizzes: [],
    totalQuizzes: 18,
    completedQuizzes: 0
  }
];

export const quizzes: Quiz[] = [
  {
    id: "quiz1",
    title: "Introduction à Word",
    description: "Apprenez les bases de l'interface de Word",
    formationId: "form1",
    questions: [],
    completed: true,
    score: 85,
    gameMode: "multiple-choice",
    difficulty: "easy"
  },
  {
    id: "quiz2",
    title: "Mise en forme de texte",
    description: "Découvrez comment mettre en forme vos documents",
    formationId: "form1",
    questions: [],
    completed: false,
    gameMode: "multiple-choice",
    difficulty: "medium"
  },
  {
    id: "quiz3",
    title: "Formules Excel",
    description: "Les formules essentielles d'Excel",
    formationId: "form2",
    questions: [],
    completed: true,
    score: 92,
    gameMode: "fill-in-blank",
    difficulty: "medium"
  }
];

export const rankings: Ranking[] = [
  {
    id: "rank1",
    userId: "user2",
    userName: "Sophie Martin",
    userAvatar: "https://i.pravatar.cc/150?u=user2",
    score: 3450,
    position: 1
  },
  {
    id: "rank2",
    userId: "user3",
    userName: "Thomas Bernard",
    userAvatar: "https://i.pravatar.cc/150?u=user3",
    score: 3200,
    position: 2
  },
  {
    id: "rank3",
    userId: "user1",
    userName: "Jean Dupont",
    userAvatar: "https://i.pravatar.cc/150?u=user1",
    score: 2580,
    position: 3
  },
  {
    id: "rank4",
    userId: "user4",
    userName: "Marie Laurent",
    userAvatar: "https://i.pravatar.cc/150?u=user4",
    score: 2340,
    position: 4
  },
  {
    id: "rank5",
    userId: "user5",
    userName: "Julien Petit",
    userAvatar: "https://i.pravatar.cc/150?u=user5",
    score: 2100,
    position: 5
  }
];

export const challenges: Challenge[] = [
  {
    id: "chall1",
    title: "Marathon Excel",
    description: "Terminez 5 quiz Excel en une semaine",
    points: 500,
    deadline: new Date(2025, 5, 15),
    completed: false
  },
  {
    id: "chall2",
    title: "Streak de 7 jours",
    description: "Connectez-vous et complétez au moins un quiz pendant 7 jours consécutifs",
    points: 300,
    completed: false
  },
  {
    id: "chall3",
    title: "Expert Photoshop",
    description: "Obtenez 100% à tous les quiz Photoshop",
    points: 800,
    completed: false
  }
];

export const notifications: Notification[] = [
  {
    id: "notif1",
    title: "Formation mise à jour",
    message: "De nouveaux quiz ont été ajoutés à la formation Excel Avancé",
    read: false,
    date: new Date(2025, 3, 18),
    type: "system"
  },
  {
    id: "notif2",
    title: "Rappel de cours",
    message: "Votre formation Word Essentiel commence demain à 14h00",
    read: true,
    date: new Date(2025, 3, 17),
    type: "schedule"
  },
  {
    id: "notif3",
    title: "Nouveau défi disponible",
    message: "Participez au Marathon Excel et gagnez 500 points supplémentaires",
    read: false,
    date: new Date(2025, 3, 15),
    type: "challenge"
  }
];

export const agendaEvents: AgendaEvent[] = [
  {
    id: "event1",
    title: "Cours Word Essentiel",
    start: new Date(2025, 3, 22, 14, 0),
    end: new Date(2025, 3, 22, 16, 0),
    formationId: "form1",
    location: "Salle 203",
    description: "Introduction aux bases de Word"
  },
  {
    id: "event2",
    title: "Atelier Excel",
    start: new Date(2025, 3, 24, 10, 0),
    end: new Date(2025, 3, 24, 12, 0),
    formationId: "form2",
    location: "Salle 106",
    description: "Formules et tableaux croisés dynamiques"
  },
  {
    id: "event3",
    title: "Cours Photoshop",
    start: new Date(2025, 3, 25, 9, 0),
    end: new Date(2025, 3, 25, 12, 0),
    formationId: "form5",
    location: "Salle 301",
    description: "Initiation à l'interface et aux outils de base"
  }
];

// Link formations to categories
categories.forEach(category => {
  category.formations = formations.filter(formation => formation.categoryId === category.id);
});

// Link quizzes to formations
formations.forEach(formation => {
  formation.quizzes = quizzes.filter(quiz => quiz.formationId === formation.id);
});
