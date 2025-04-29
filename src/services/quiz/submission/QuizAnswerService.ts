
import apiClient from '@/lib/api-client';
import type { Question, Answer } from '@/types/quiz';

export class QuizAnswerService {
  async getQuizQuestions(quizId: number): Promise<Question[]> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/questions`);
      console.log('API response for quiz questions:', response.data);
      
      const questions = response.data.data || [];
      return questions.map((question: any) => this.formatQuestion(question));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, string[] | string | Record<string, string>>, timeSpent: number): Promise<any> {
    try {
      console.log('Submitting quiz answers:', { quizId, answers, timeSpent });
      
      // Format answers for API
      const formattedAnswers: Record<string, any> = {};
      Object.entries(answers).forEach(([questionId, answerValue]) => {
        formattedAnswers[questionId] = answerValue;
      });

      const response = await apiClient.post(`/quiz/${quizId}/result`, {
        answers: formattedAnswers,
        timeSpent
      });

      console.log('Quiz submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  private formatQuestion(question: any): Question {
    // Transformer les réponses
    const answers: Answer[] = (question.reponses || []).map((reponse: any) => ({
      id: String(reponse.id),
      text: reponse.text || '',
      isCorrect: Boolean(reponse.is_correct),
      position: reponse.position || null,
      match_pair: reponse.match_pair || null,
      bank_group: reponse.bank_group || null,
      flashcard_back: reponse.flashcard_back || null
    }));

    // Détecter le type de question et formater en conséquence
    const questionType = this.mapQuestionType(question.type || '');
    
    // Créer des blancs pour les questions de type "remplir le champ vide"
    let blanks = undefined;
    if (questionType === 'remplir le champ vide') {
      const blankMatches = question.text.match(/\{([^}]+)\}/g);
      if (blankMatches) {
        blanks = blankMatches.map((match: string, index: number) => {
          const groupName = match.replace(/[{}]/g, '');
          return {
            id: `blank_${index}`,
            text: answers.find((a) => a.isCorrect)?.text || '',
            position: index,
            bankGroup: groupName
          };
        });
      }
    }

    // Pour les flashcards, on doit ajouter les informations du verso
    let flashcard = undefined;
    if (questionType === 'carte flash' && answers.length > 0) {
      const correctAnswer = answers.find(a => a.isCorrect);
      if (correctAnswer) {
        flashcard = {
          front: correctAnswer.text,
          back: correctAnswer.flashcard_back || ''
        };
      }
    }

    // Pour les correspondances, on doit formater les paires
    let matching = undefined;
    if (questionType === 'correspondance') {
      matching = answers.map(a => ({
        id: a.id,
        text: a.text,
        matchPair: a.match_pair || ''
      }));
    }

    // Pour le word bank, on formate les groupes
    let wordbank = undefined;
    if (questionType === 'banque de mots') {
      wordbank = answers.map(a => ({
        id: a.id,
        text: a.text,
        isCorrect: a.isCorrect,
        bankGroup: a.bank_group || null
      }));
    }

    // Construire l'objet question formaté
    return {
      id: String(question.id),
      text: question.text || '',
      type: questionType,
      points: question.points ? Number(question.points) : undefined,
      astuce: question.astuce || undefined,
      explication: question.explication || undefined,
      audioUrl: question.type === 'question audio' ? question.media_url : undefined,
      media_url: question.type !== 'question audio' ? question.media_url : undefined,
      reponses: answers,
      answers,
      blanks,
      matching,
      flashcard,
      wordbank
    };
  }

  private mapQuestionType(type: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      'multiplechoice': 'choix multiples',
      'multiple-choice': 'choix multiples',
      'multiple_choice': 'choix multiples',
      'multiple choice': 'choix multiples',
      'choix multiples': 'choix multiples',
      'truefalse': 'vrai/faux',
      'true-false': 'vrai/faux',
      'true_false': 'vrai/faux',
      'true false': 'vrai/faux',
      'vrai/faux': 'vrai/faux',
      'fillblank': 'remplir le champ vide',
      'fill-in-blank': 'remplir le champ vide',
      'fill_in_blank': 'remplir le champ vide',
      'fill in blank': 'remplir le champ vide',
      'remplir le champ vide': 'remplir le champ vide',
      'ordering': 'rearrangement',
      'order': 'rearrangement',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'match': 'correspondance',
      'correspondance': 'correspondance',
      'flash-card': 'carte flash',
      'flashcard': 'carte flash',
      'flash_card': 'carte flash',
      'flash card': 'carte flash',
      'carte flash': 'carte flash',
      'wordbank': 'banque de mots',
      'word-bank': 'banque de mots',
      'word_bank': 'banque de mots',
      'word bank': 'banque de mots',
      'banque de mots': 'banque de mots',
      'audioquestion': 'question audio',
      'audio-question': 'question audio',
      'audio_question': 'question audio',
      'audio question': 'question audio',
      'question audio': 'question audio'
    };
    return typeMap[type.toLowerCase()] || type as Question['type'];
  }
}

export const quizAnswerService = new QuizAnswerService();
