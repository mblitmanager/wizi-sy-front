
import type { Quiz, Question } from '@/types/quiz';
import { categoryService } from '../CategoryService';
import { formations } from '@/data/mockData';

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
  async formatStagiaireQuiz(quiz: any) {
       return {
      id: quiz.id,
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.formation?.categorie || quiz.category || '',
      categorieId: quiz.formation?.categorieId || quiz.category_id || quiz.categoryId || '',
      niveau: quiz.niveau || quiz.level || '',
      formations: quiz.formation ? [quiz.formation] : (formations || []),
      formationId: quiz.formation?.id || quiz.formationId || quiz.formation_id || null,
      formation: quiz.formation || null,
      questions: this.formatQuestions(quiz.questions || []),
      points: quiz.points || 0
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
