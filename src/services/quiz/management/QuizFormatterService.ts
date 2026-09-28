
import type { Quiz, Question } from '@/types/quiz';
import { categoryService } from '../CategoryService';

export class QuizFormatterService {
  async formatQuiz(quiz: any, categories?: any[]) {
    if (!categories) {
      categories = await categoryService.getCategories();
    }
    
    let categorieId = '';
    let categorie = '';
    
    const titre = (quiz.titre || quiz.title || '').toLowerCase();
    if (titre.includes('excel') || titre.includes('bureautique')) {
      const bureautique = categories.find(c => c.name.toLowerCase() === 'bureautique');
      if (bureautique) {
        categorieId = bureautique.id;
        categorie = bureautique.name;
      }
    } else if (titre.includes('anglais') || titre.includes('français') || titre.includes('langues')) {
      const langues = categories.find(c => c.name.toLowerCase() === 'langues');
      if (langues) {
        categorieId = langues.id;
        categorie = langues.name;
      }
    }

    return {
      id: quiz.id,
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.categorie || quiz.category || categorie,
      categorieId: quiz.categorieId || quiz.category_id || quiz.categoryId || categorieId,
      niveau: quiz.niveau || quiz.level || '',
      questions: this.formatQuestions(quiz.questions || []),
      points: quiz.points || 0
    };
  }
  /** Format de `GET /stagiaire/quizzes` (QuizStagiaireController::getStagiaireQuizzes). */
  async formatStagiaireQuiz(quiz: any) {
    const questions = this.formatQuestions(quiz.questions || []);
    const questionPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    return {
      id: quiz.id,
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.formation?.categorie || quiz.category || '',
      categorieId: quiz.formation?.categorieId || quiz.category_id || quiz.categoryId || '',
      niveau: quiz.niveau || quiz.level || '',
      duree: quiz.duree ?? undefined,
      // Pas de formations fictives : un quiz sans formation ne doit correspondre à aucun filtre
      formations: quiz.formation ? [quiz.formation] : [],
      formationId: quiz.formation?.id || quiz.formationId || quiz.formation_id || null,
      formation: quiz.formation || null,
      questions,
      // Total officiel du backend (nb_points_total), à défaut la somme des points des questions
      points: Number(quiz.nb_points_total) || questionPoints || Number(quiz.points) || 0,
      // Dernière participation (QuizParticipation) renvoyée par le backend
      userParticipation: quiz.userParticipation ?? null,
    };
  }

  formatQuestions(questions: any[]): Question[] {
    return questions.map(question => ({
      ...question,
      type: this.mapQuestionType(question.type),
      audioUrl: question.media_url || question.audioUrl,
      explication: question.explication || '',
      points: question.points || 0,
      astuce: question.astuce || '',
      answers: question.answers?.map((answer: any) => ({
        ...answer,
        isCorrect: answer.reponse_correct || answer.isCorrect || false
      }))
    }));
  }

  mapQuestionType(type: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      'multiplechoice': 'choix multiples',
      'multiple-choice': 'choix multiples',
      'truefalse': 'vrai/faux',
      'true-false': 'vrai/faux',
      'fillblank': 'remplir le champ vide',
      'fill-in-blank': 'remplir le champ vide',
      'ordering': 'rearrangement',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'flashcard': 'carte flash',
      'flash-card': 'carte flash',
      'wordbank': 'banque de mots',
      'word-bank': 'banque de mots',
      'audioquestion': 'question audio',
      'audio-question': 'question audio'
    };
    return typeMap[type] || type as Question['type'];
  }
}

export const quizFormatterService = new QuizFormatterService();
