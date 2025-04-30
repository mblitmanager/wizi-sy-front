
import { Question } from '@/types/quiz';

export const formatAnswer = (question: Question, userAnswer: any): string => {
  if (!userAnswer) return "Aucune réponse";
  
  switch (question.type) {
    case 'remplir le champ vide': {
      // Pour les questions fillblank, les réponses sont un objet de type { blank_1: "valeur" }
      if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
        return Object.values(userAnswer).join(', ') || "Aucune réponse";
      }
      return String(userAnswer);
    }
    
    case 'correspondance': {
      // Pour les questions matching, on affiche les paires
      if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
        const pairs = [];
        for (const leftId in userAnswer) {
          if (leftId !== 'destination') {
            const rightValue = userAnswer[leftId];
            const leftItem = question.answers?.find(a => a.id === leftId);
            pairs.push(`${leftItem?.text || leftId} → ${rightValue}`);
          }
        }
        return pairs.join('; ') || "Aucune réponse";
      }
      
      // Format alternatif (array)
      if (Array.isArray(userAnswer)) {
        return userAnswer.map(id => {
          if (typeof id === 'string' && id.includes('-')) {
            const [leftId, rightId] = id.split('-');
            const leftItem = question.answers?.find(a => a.id === leftId);
            const rightItem = question.answers?.find(a => a.id === rightId);
            return `${leftItem?.text || leftId} → ${rightItem?.text || rightId}`;
          }
          return id;
        }).join('; ');
      }
      
      return String(userAnswer);
    }
    
    case 'carte flash': {
      // Pour les cartes flash, retourner le texte de la réponse
      if (question.answers) {
        const answer = question.answers.find(a => a.id === String(userAnswer) || a.text === userAnswer);
        return answer ? answer.text : String(userAnswer);
      }
      return String(userAnswer);
    }
      
    case 'vrai/faux': {
      // Pour les questions vrai/faux, on affiche le texte de la réponse
      const answer = question.answers?.find(a => a.id === String(userAnswer));
      return answer ? answer.text : String(userAnswer);
    }
    
    case 'rearrangement': {
      // Pour les questions d'ordre, afficher les étapes dans l'ordre soumis
      if (Array.isArray(userAnswer)) {
        return userAnswer.map((id, index) => {
          const answer = question.answers?.find(a => a.id === String(id));
          return `${index + 1}. ${answer?.text || id}`;
        }).join(', ');
      }
      return String(userAnswer);
    }
    
    default: {
      // Pour les autres types de questions (QCM, etc.)
      if (Array.isArray(userAnswer)) {
        const answerTexts = userAnswer.map(id => {
          const answer = question.answers?.find(a => a.id === String(id));
          return answer?.text || id;
        });
        return answerTexts.join(', ') || "Aucune réponse";
      }
      // Si c'est une réponse unique
      const answer = question.answers?.find(a => a.id === String(userAnswer));
      return answer ? answer.text : String(userAnswer);
    }
  }
};

export const formatCorrectAnswer = (question: Question): string => {
  switch (question.type) {
    case 'remplir le champ vide': {
      // Trouver les réponses par bank_group défini
      const blanks = {};
      question.answers?.forEach(a => {
        if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
          blanks[a.bank_group] = a.text;
        }
      });
      
      if (Object.keys(blanks).length > 0) {
        return Object.values(blanks).join(', ');
      }
      
      // Si pas de bank_group, utiliser les réponses correctes
      const correctFillAnswers = question.answers?.filter(a => a.isCorrect || a.is_correct === 1);
      if (correctFillAnswers && correctFillAnswers.length) {
        return correctFillAnswers.map(a => a.text).join(', ');
      }
      
      // Si on a des correctAnswers disponibles
      if (question.correctAnswers && question.correctAnswers.length) {
        const answerTexts = question.correctAnswers.map(id => {
          const answer = question.answers?.find(a => a.id === String(id) || a.id === id);
          return answer ? answer.text : id;
        });
        return answerTexts.join(', ');
      }
      
      return "Aucune réponse correcte définie";
    }
    
    case 'correspondance': {
      // Pour les questions matching, trouver les paires correctes
      const pairs = [];
      question.answers?.forEach(a => {
        if (a.match_pair) {
          pairs.push(`${a.text} → ${a.match_pair}`);
        }
      });
      return pairs.length > 0 ? pairs.join('; ') : "Aucune réponse correcte définie";
    }
    
    case 'carte flash': {
      // Pour les cartes flash, trouver la réponse correcte
      const flashcard = question.answers?.find(a => a.isCorrect || a.is_correct === 1);
      if (flashcard) {
        return `${flashcard.text}${flashcard.flashcard_back ? ` (${flashcard.flashcard_back})` : ''}`;
      }
      return "Aucune réponse correcte définie";
    }
      
    case 'rearrangement': {
      // Pour les questions d'arrangement, ordonner par position
      const orderedAnswers = [...(question.answers || [])].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );
      return orderedAnswers.map((a, i) => `${i + 1}. ${a.text}`).join(', ');
    }
      
    case 'vrai/faux': {
      // Pour les questions vrai/faux, trouver la réponse correcte
      const correctAnswer = question.answers?.find(a => a.isCorrect || a.is_correct === 1);
      return correctAnswer ? correctAnswer.text : "Aucune réponse correcte définie";
    }
    
    case 'banque de mots': {
      // Pour les questions banque de mots, montrer les mots corrects
      const correctWords = question.answers?.filter(a => a.isCorrect || a.is_correct === 1);
      if (correctWords && correctWords.length) {
        return correctWords.map(a => a.text).join(', ');
      }
      return "Aucune réponse correcte définie";
    }
    
    default: {
      // Pour les QCM, trouver les réponses correctes
      const correctAnswers = question.answers?.filter(a => a.isCorrect || a.is_correct === 1);
      if (correctAnswers && correctAnswers.length) {
        return correctAnswers.map(a => a.text).join(', ');
      }
      
      // Si on a des correctAnswers disponibles
      if (question.correctAnswers && question.correctAnswers.length) {
        const answerTexts = question.correctAnswers.map(id => {
          const answer = question.answers?.find(a => a.id === String(id) || a.id === id);
          return answer ? answer.text : id;
        });
        return answerTexts.join(', ');
      }
      
      return "Aucune réponse correcte définie";
    }
  }
};

export const isAnswerCorrect = (question: Question, userAnswer: any): boolean => {
  if (question.isCorrect !== undefined) {
    // Si la question fournit déjà l'information
    return question.isCorrect;
  }
  
  if (!userAnswer) return false;
  
  switch (question.type) {
    case 'remplir le champ vide': {
      // Pour les questions à blancs, vérifier chaque champ
      if (typeof userAnswer !== 'object' || Array.isArray(userAnswer)) return false;
      
      const correctBlanks = {};
      question.answers?.forEach(a => {
        if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
          correctBlanks[a.bank_group] = a.text;
        }
      });
      
      if (Object.keys(correctBlanks).length === 0) return false;
      
      return Object.entries(userAnswer).every(([key, value]) => {
        const correctAnswer = correctBlanks[key];
        return correctAnswer && String(value).toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      });
    }
    
    case 'correspondance': {
      // Pour les correspondances
      if (typeof userAnswer !== 'object') return false;
      
      if (Array.isArray(userAnswer)) {
        // Format array (leftId-rightId)
        return userAnswer.every(id => {
          if (typeof id !== 'string' || !id.includes('-')) return false;
          
          const [leftId, rightId] = id.split('-');
          const leftItem = question.answers?.find(a => a.id === leftId);
          const rightItem = question.answers?.find(a => a.id === rightId);
          
          return leftItem && rightItem && leftItem.match_pair === rightItem.text;
        });
      } else {
        // Format objet {leftId: rightValue}
        return Object.entries(userAnswer).every(([leftId, rightValue]) => {
          if (leftId === 'destination') return true;
          
          const leftItem = question.answers?.find(a => a.id === leftId);
          return leftItem && leftItem.match_pair === rightValue;
        });
      }
    }
    
    case 'rearrangement': {
      // Pour le réarrangement, vérifier l'ordre
      if (!Array.isArray(userAnswer)) return false;
      
      const correctOrder = [...(question.answers || [])].sort((a, b) => 
        (a.position || 0) - (b.position || 0)
      ).map(a => a.id);
      
      return JSON.stringify(userAnswer) === JSON.stringify(correctOrder);
    }
    
    case 'carte flash': {
      // Pour les flashcards
      const correctAnswer = question.answers?.find(a => a.isCorrect || a.is_correct === 1);
      return correctAnswer && (correctAnswer.text === userAnswer || correctAnswer.id === String(userAnswer));
    }
    
    case 'vrai/faux': {
      // Pour les questions vrai/faux
      const correctAnswerIds = question.answers
        ?.filter(a => a.isCorrect || a.is_correct === 1)
        .map(a => a.id);
        
      return correctAnswerIds?.includes(String(userAnswer));
    }
    
    case 'banque de mots': {
      // Pour banque de mots
      if (!Array.isArray(userAnswer)) return false;
      
      const correctAnswerIds = question.answers
        ?.filter(a => a.isCorrect || a.is_correct === 1)
        .map(a => a.id);
      
      if (!correctAnswerIds?.length) return false;
      
      // Vérifier que tous les mots corrects ont été sélectionnés et aucun incorrect
      const selectedIds = userAnswer.map(id => String(id));
      return correctAnswerIds.every(id => selectedIds.includes(String(id))) 
             && selectedIds.every(id => correctAnswerIds.includes(String(id)));
    }
    
    default: {
      // Pour QCM
      const correctAnswerIds = question.answers
        ?.filter(a => a.isCorrect || a.is_correct === 1)
        .map(a => a.id);
      
      if (!correctAnswerIds?.length) {
        // Tenter d'utiliser correctAnswers si disponible
        if (question.correctAnswers && question.correctAnswers.length) {
          const correctIds = question.correctAnswers.map(id => String(id));
          
          if (Array.isArray(userAnswer)) {
            // Convertir tous les éléments en string pour la comparaison
            const normalizedUserAnswers = userAnswer.map(id => String(id));
            return correctIds.length === normalizedUserAnswers.length && 
                   correctIds.every(id => normalizedUserAnswers.includes(id));
          } else {
            return correctIds.includes(String(userAnswer));
          }
        }
        return false;
      }
      
      if (Array.isArray(userAnswer)) {
        // Si plusieurs réponses sont attendues (QCM multi)
        // Convertir tous les éléments en string pour la comparaison
        const normalizedUserAnswers = userAnswer.map(id => String(id));
        return correctAnswerIds.length === normalizedUserAnswers.length && 
               correctAnswerIds.every(id => normalizedUserAnswers.includes(id));
      } else {
        // Si une seule réponse est attendue (QCM simple)
        return correctAnswerIds.includes(String(userAnswer));
      }
    }
  }
};
