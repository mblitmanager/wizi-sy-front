
import { Answer, Category, Quiz, QuizResult, UserProgress, LeaderboardEntry } from '@/types/quiz';
import { User } from '@/types';

// Convert API response to frontend Category
export const convertToCategory = (data: any): Category => {
  return {
    id: data.id || data.name || '',
    name: data.name || '',
    description: data.description || `Quizzes dans la catégorie ${data.name || ''}`,
    icon: data.icon || '',
    color: data.color || '#4F46E5',
    colorClass: data.colorClass || 'category-blue-500',
    quizCount: data.quizCount || 0
  };
};

// Convert API response to frontend Quiz
export const convertToQuiz = (data: any): Quiz => {
  return {
    id: data.id || '',
    title: data.title || data.titre || '',
    titre: data.titre || data.title || '',
    description: data.description || '',
    category: data.category || data.categorie || '',
    categoryId: data.categoryId || data.categorie_id || '',
    level: data.level || data.niveau || 'débutant',
    niveau: data.niveau || data.level || 'débutant',
    questions: data.questions || [],
    points: data.points || data.nb_points_total || 0,
    nb_points_total: data.nb_points_total || data.points || 0,
    timeLimit: data.timeLimit || data.temps_limite || 0
  };
};

// Convert API response to frontend Answer
export const convertToAnswer = (data: any): Answer => {
  return {
    id: data.id || '',
    text: data.text || data.texte || '',
    is_correct: typeof data.is_correct === 'boolean' ? (data.is_correct ? 1 : 0) : data.is_correct,
    question_id: data.question_id || '',
    match_pair: data.match_pair || data.paire_correspondante || '',
    bank_group: data.bank_group || data.groupe_banque || '',
    flashcard_back: data.flashcard_back || data.verso_carte || ''
  };
};

// Convert API response to frontend User
export const convertToUser = (data: any): User => {
  return {
    id: data.id || '',
    username: data.username || data.name || '',
    email: data.email || '',
    level: data.level || 1,
    points: data.points || 0,
    avatar: data.avatar || '',
    firstname: data.firstname || data.prenom || '',
    lastname: data.lastname || data.nom || '',
    role: data.role || 'user'
  };
};

// Convert API response to frontend QuizResult
export const convertToQuizResult = (data: any): QuizResult => {
  return {
    id: data.id || '',
    quizId: data.quizId || data.quiz_id || '',
    userId: data.userId || data.user_id || '',
    score: data.score || 0,
    correctAnswers: data.correctAnswers || data.reponses_correctes || 0,
    totalQuestions: data.totalQuestions || data.questions_totales || 0,
    completedAt: data.completedAt || data.completed_at || new Date().toISOString(),
    timeSpent: data.timeSpent || data.temps_passe || 0,
    quizName: data.quizName || data.quiz_titre || '',
    answers: data.answers || data.reponses || {}
  };
};
