
import type { Quiz, Question } from '@/types/quiz';
import { categoryService } from '../CategoryService';

export class QuizFormatterService {
  async formatQuiz(quiz: any, categories?: any[]): Promise<Quiz> {
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
      id: String(quiz.id),
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.categorie || quiz.category || categorie,
      categorieId: quiz.categorieId || quiz.category_id || quiz.categoryId || categorieId,
      niveau: quiz.niveau || quiz.level || '',
      questions: this.formatQuestions(quiz.questions || []),
      points: quiz.points || 0,
      duree: quiz.duree || quiz.duration || 0
    };
  }

  formatQuestions(questions: any[]): Question[] {
    return questions.map(question => ({
      ...question,
      id: String(question.id),
      type: this.mapQuestionType(question.type),
      audioUrl: question.media_url || question.audioUrl,
      explication: question.explication || '',
      points: question.points || 0,
      astuce: question.astuce || '',
      answers: this.formatAnswers(question.answers || question.reponses || [])
    }));
  }
  
  formatAnswers(answers: any[]): any[] {
    return answers.map(answer => ({
      ...answer,
      id: String(answer.id),
      isCorrect: answer.reponse_correct || answer.isCorrect || answer.is_correct === 1 || false
    }));
  }

  mapQuestionType(type: string): Question['type'] {
    if (!type) return 'choix multiples'; // Default type if none provided
    
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
      'audio-question': 'question audio',
      'audio': 'question audio',
      'question audio': 'question audio'
    };
    
    const normalizedType = type.toLowerCase().trim();
    return typeMap[normalizedType] || normalizedType as Question['type'];
  }
}

export const quizFormatterService = new QuizFormatterService();
