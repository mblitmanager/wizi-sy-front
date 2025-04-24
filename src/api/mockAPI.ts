import { Category, Quiz, LeaderboardEntry } from '../types';

// Mock de l'API pour le développement
export const mockAPI = {
  getAllQuizzes: (): Quiz[] => {
    const categories = mockAPI.getCategories();
    return categories.flatMap(category => 
      mockAPI.getQuizzesByCategory(category.id)
    );
  },
  
  getCategories: (): Category[] => [
    {
      id: '1',
      name: 'Bureautique',
      color: '#3D9BE9',
      icon: 'file-text',
      description: 'Maîtrisez les outils de bureautique essentiels',
      quizCount: 8,
      colorClass: 'category-bureautique'
    },
    {
      id: '2',
      name: 'Langues',
      color: '#A55E6E',
      icon: 'message-square',
      description: 'Améliorez vos compétences linguistiques',
      quizCount: 6,
      colorClass: 'category-langues'
    },
    {
      id: '3',
      name: 'Internet',
      color: '#FFC533',
      icon: 'globe',
      description: 'Découvrez le monde du web et des réseaux sociaux',
      quizCount: 5,
      colorClass: 'category-internet'
    },
    {
      id: '4',
      name: 'Création',
      color: '#9392BE',
      icon: 'palette',
      description: 'Explorez les outils de création graphique',
      quizCount: 7,
      colorClass: 'category-creation'
    },
  ],

  getQuizzesByCategory: (categoryId: string): Quiz[] => {
    const quizzes: Record<string, Quiz[]> = {
      '1': [ // Bureautique
        {
          id: '1',
          title: 'Les bases de Word',
          description: 'Apprenez les fondamentaux de Microsoft Word',
          category: 'Bureautique',
          categoryId: '1',
          level: 'débutant' as const,
          questions: [
            {
              id: '1',
              text: 'Comment créer un nouveau document dans Word?',
              answers: [
                { id: '1', text: 'Fichier > Nouveau', isCorrect: true },
                { id: '2', text: 'Edition > Créer', isCorrect: false },
                { id: '3', text: 'Outils > Document', isCorrect: false },
                { id: '4', text: 'Affichage > Nouveau', isCorrect: false },
              ],
            },
            {
              id: '2',
              text: 'Quel raccourci clavier permet de mettre un texte en gras?',
              answers: [
                { id: '1', text: 'Ctrl+G', isCorrect: false },
                { id: '2', text: 'Ctrl+B', isCorrect: true },
                { id: '3', text: 'Ctrl+F', isCorrect: false },
                { id: '4', text: 'Ctrl+I', isCorrect: false },
              ],
            },
            {
              id: '3',
              text: 'Comment insérer un tableau dans Word?',
              answers: [
                { id: '1', text: 'Insertion > Tableau', isCorrect: true },
                { id: '2', text: 'Affichage > Tableau', isCorrect: false },
                { id: '3', text: 'Format > Insérer un tableau', isCorrect: false },
                { id: '4', text: 'Outils > Tableau', isCorrect: false },
              ],
            },
            {
              id: '4',
              text: 'Comment vérifier l\'orthographe dans Word?',
              answers: [
                { id: '1', text: 'Ctrl+F7', isCorrect: false },
                { id: '2', text: 'F7', isCorrect: true },
                { id: '3', text: 'Ctrl+O', isCorrect: false },
                { id: '4', text: 'Shift+F7', isCorrect: false },
              ],
            },
            {
              id: '5',
              text: 'Quelle extension ont les fichiers Word par défaut?',
              answers: [
                { id: '1', text: '.doc', isCorrect: false },
                { id: '2', text: '.docx', isCorrect: true },
                { id: '3', text: '.wrd', isCorrect: false },
                { id: '4', text: '.txt', isCorrect: false },
              ],
            },
          ],
          points: 10,
        },
        {
          id: '2',
          title: 'Excel pour débutants',
          description: 'Les premières étapes avec Microsoft Excel',
          category: 'Bureautique',
          categoryId: '1',
          level: 'débutant' as const,
          questions: [
            {
              id: '1',
              text: 'Dans Excel, que signifie la référence A1?',
              answers: [
                { id: '1', text: 'La première formule', isCorrect: false },
                { id: '2', text: 'La cellule à l\'intersection de la colonne A et de la ligne 1', isCorrect: true },
                { id: '3', text: 'Le premier graphique', isCorrect: false },
                { id: '4', text: 'La première feuille de calcul', isCorrect: false },
              ],
            },
            {
              id: '2',
              text: 'Quelle formule permet de calculer la somme des cellules A1 à A10?',
              answers: [
                { id: '1', text: '=SUM(A1-A10)', isCorrect: false },
                { id: '2', text: '=SUM(A1:A10)', isCorrect: true },
                { id: '3', text: '=SOMME(A1:A10)', isCorrect: false },
                { id: '4', text: '=TOTAL(A1:A10)', isCorrect: false },
              ],
            },
            {
              id: '3',
              text: 'Comment figer la première ligne dans Excel?',
              answers: [
                { id: '1', text: 'Affichage > Figer les volets > Figer la première ligne', isCorrect: true },
                { id: '2', text: 'Insertion > Figer > Première ligne', isCorrect: false },
                { id: '3', text: 'Format > Ligne > Figer', isCorrect: false },
                { id: '4', text: 'Outils > Options > Figer la première ligne', isCorrect: false },
              ],
            },
            {
              id: '4',
              text: 'Quelle fonction permet de trouver la valeur la plus élevée dans une plage?',
              answers: [
                { id: '1', text: '=HIGHEST', isCorrect: false },
                { id: '2', text: '=MAXIMUM', isCorrect: false },
                { id: '3', text: '=MAX', isCorrect: true },
                { id: '4', text: '=TOP', isCorrect: false },
              ],
            },
            {
              id: '5',
              text: 'Comment modifier la largeur d\'une colonne?',
              answers: [
                { id: '1', text: 'Double-cliquer sur le bord droit de l\'en-tête de colonne', isCorrect: true },
                { id: '2', text: 'Cliquer-droit > Largeur de colonne', isCorrect: false },
                { id: '3', text: 'Format > Colonne > Largeur', isCorrect: false },
                { id: '4', text: 'Toutes ces réponses sont correctes', isCorrect: true },
              ],
            },
          ],
          points: 10,
        },
        {
          id: '3',
          title: 'PowerPoint Essentiel',
          description: 'Créez des présentations professionnelles',
          category: 'Bureautique',
          categoryId: '1',
          level: 'intermédiaire' as const,
          questions: [],
          points: 15,
        },
      ],
      '2': [ // Langues
        {
          id: '4',
          title: 'Français - Les bases',
          description: 'Maîtrisez les fondamentaux de la langue française',
          category: 'Langues',
          categoryId: '2',
          level: 'débutant' as const,
          questions: [
            {
              id: '1',
              text: 'Quel est le féminin de "acteur"?',
              answers: [
                { id: '1', text: 'actrice', isCorrect: true },
                { id: '2', text: 'acteure', isCorrect: false },
                { id: '3', text: 'acteuse', isCorrect: false },
                { id: '4', text: 'actresse', isCorrect: false },
              ],
            },
            {
              id: '2',
              text: 'Quelle est la bonne orthographe?',
              answers: [
                { id: '1', text: 'language', isCorrect: false },
                { id: '2', text: 'langage', isCorrect: true },
                { id: '3', text: 'langaje', isCorrect: false },
                { id: '4', text: 'langagge', isCorrect: false },
              ],
            },
            {
              id: '3',
              text: 'Quel est le pluriel de "journal"?',
              answers: [
                { id: '1', text: 'journals', isCorrect: false },
                { id: '2', text: 'journaux', isCorrect: true },
                { id: '3', text: 'journaus', isCorrect: false },
                { id: '4', text: 'journeaux', isCorrect: false },
              ],
            },
            {
              id: '4',
              text: 'Quel temps est utilisé dans la phrase: "Je mangeais quand il est arrivé"?',
              answers: [
                { id: '1', text: 'Présent', isCorrect: false },
                { id: '2', text: 'Passé composé', isCorrect: false },
                { id: '3', text: 'Imparfait', isCorrect: true },
                { id: '4', text: 'Futur', isCorrect: false },
              ],
            },
            {
              id: '5',
              text: 'Quelle est la bonne forme?',
              answers: [
                { id: '1', text: 'Je le lui ai dit', isCorrect: true },
                { id: '2', text: 'Je lui l\'ai dit', isCorrect: false },
                { id: '3', text: 'Je lui ai le dit', isCorrect: false },
                { id: '4', text: 'Je l\'ai lui dit', isCorrect: false },
              ],
            },
          ],
          points: 10,
        },
        {
          id: '5',
          title: 'Anglais Débutant',
          description: 'Apprenez les bases de l\'anglais',
          category: 'Langues',
          categoryId: '2',
          level: 'débutant' as const,
          questions: [],
          points: 10,
        },
      ],
      '3': [ // Internet
        {
          id: '6',
          title: 'Les bases de WordPress',
          description: 'Apprenez à créer et gérer un site WordPress',
          category: 'Internet',
          categoryId: '3',
          level: 'débutant' as const,
          questions: [],
          points: 10,
        },
        {
          id: '7',
          title: 'Réseaux sociaux',
          description: 'Optimisez votre présence sur les réseaux sociaux',
          category: 'Internet',
          categoryId: '3',
          level: 'intermédiaire' as const,
          questions: [],
          points: 15,
        },
      ],
      '4': [ // Création
        {
          id: '8',
          title: 'Introduction à Photoshop',
          description: 'Découvrez les fondamentaux de Photoshop',
          category: 'Création',
          categoryId: '4',
          level: 'débutant' as const,
          questions: [],
          points: 10,
        },
        {
          id: '9',
          title: 'Illustrator pour débutants',
          description: 'Les bases essentielles d\'Illustrator',
          category: 'Création',
          categoryId: '4',
          level: 'débutant' as const,
          questions: [],
          points: 10,
        },
      ],
    };

    return quizzes[categoryId] || [];
  },

  getLeaderboard: (): LeaderboardEntry[] => [
    { userId: '1', username: 'JeanDupont', points: 1250, level: 8, rank: 1 },
    { userId: '2', username: 'MarieMartin', points: 980, level: 6, rank: 2 },
    { userId: '3', username: 'PierreDurand', points: 870, level: 5, rank: 3 },
    { userId: '4', username: 'SophieBernard', points: 750, level: 4, rank: 4 },
    { userId: '5', username: 'LucRobert', points: 650, level: 4, rank: 5 },
    { userId: '6', username: 'AnneMoreau', points: 580, level: 3, rank: 6 },
    { userId: '7', username: 'ThomasRichard', points: 520, level: 3, rank: 7 },
    { userId: '8', username: 'EliseLefebvre', points: 480, level: 3, rank: 8 },
    { userId: '9', username: 'MichelPetit', points: 420, level: 2, rank: 9 },
    { userId: '10', username: 'ClaireRousseau', points: 380, level: 2, rank: 10 },
  ],

  loginUser: (email: string, password: string) => {
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        id: 'admin1',
        username: 'AdminUser',
        email: 'admin@example.com',
        points: 0,
        level: 1,
        role: 'admin' as const
      };
    } else if (email === 'demo@example.com' && password === 'password') {
      return {
        id: '1',
        username: 'JeanDupont',
        email: 'demo@example.com',
        points: 1250,
        level: 8,
        role: 'stagiaire' as const
      };
    }
    throw new Error('Identifiants incorrects');
  },

  registerUser: (username: string, email: string, password: string) => {
    if (email === 'demo@example.com') {
      throw new Error('Cet email est déjà utilisé');
    }
    
    return {
      id: 'new_user_' + Date.now().toString(),
      username,
      email,
      points: 0,
      level: 1,
      role: 'stagiaire' as const
    };
  },

  submitQuizResult: (quizId: string, correctAnswers: number, totalQuestions: number, timeSpent: number) => {
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    return {
      id: 'result_' + Date.now().toString(),
      quizId,
      userId: '1',
      score,
      correctAnswers,
      totalQuestions,
      completedAt: new Date().toISOString(),
      timeSpent,
    };
  }
};
