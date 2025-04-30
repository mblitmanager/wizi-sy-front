import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuizSummaryProps {
  quiz: Quiz;
  questions: Question[];
  userAnswers: Record<string, any>;
  score: number;
  totalQuestions: number;
}

// Fonction utilitaire pour normaliser les chaînes (accents, casse, espaces)
function normalizeString(str: string): string {
  return str
    .normalize('NFD') // décompose les accents
    .replace(/\u0300-\u036f/g, '') // supprime les diacritiques
    .toLowerCase()
    .trim();
}

export function QuizSummary({ quiz, questions, userAnswers, score, totalQuestions }: QuizSummaryProps) {
  const navigate = useNavigate();
  
  // Calculer le niveau de réussite
  const successLevel = 
    score >= 80 ? "Excellent" :
    score >= 70 ? "Très bien" :
    score >= 60 ? "Bien" :
    score >= 50 ? "Moyen" :
    "À améliorer";

  const formatAnswer = (question: Question, userAnswer: any) => {
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
        
      // case 'vrai/faux': {
      //   // Pour les questions vrai/faux, on affiche le texte de la réponse
      //   const answer = question.answers?.find(a => a.id === String(userAnswer));
      //   return answer ? answer.text : String(userAnswer);
      // }
      
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
        console.log("user anwerquestion");
        console.log(userAnswer);
        // Si c'est une réponse unique
        const answer = question.answers?.find(a => a.id === String(userAnswer));
        return answer ? answer.text : String(userAnswer);
      }
    }
  };

  const formatCorrectAnswer = (question: Question) => {
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
        
      // case 'vrai/faux': {
      //   // Pour les questions vrai/faux, trouver la réponse correcte
      //   const correctAnswer = question.answers?.find(a => a.isCorrect || a.is_correct === 1);
      //   return correctAnswer ? correctAnswer.text : "Aucune réponse correcte définie";
      // }
      
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

  const isAnswerCorrect = (question: Question): boolean => {
    // On ne fait confiance à isCorrect que si c'est explicitement true
    if (question.isCorrect === true) {
      return true;
    }
    // Sinon, on vérifie normalement
    const userAnswerData = userAnswers[question.id];
    if (!userAnswerData) return false;
    
    switch (question.type) {
      case 'remplir le champ vide': {
        // Pour les questions à blancs, vérifier chaque champ
        if (typeof userAnswerData !== 'object' || Array.isArray(userAnswerData)) return false;
        
        const correctBlanks = {};
        question.answers?.forEach(a => {
          if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
            correctBlanks[a.bank_group] = a.text;
          }
        });
        
        // Cas classique avec bank_group
        if (Object.keys(correctBlanks).length > 0) {
          return Object.entries(userAnswerData).every(([key, value]) => {
            const correctAnswer = correctBlanks[key];
            if (!correctAnswer) return false;
            return normalizeString(String(value)) === normalizeString(correctAnswer);
          });
        }
        
        // Cas sans bank_group, plusieurs champs à remplir
        const correctAnswers = question.answers?.filter(a => a.isCorrect || a.is_correct === 1);
        const userValues = Object.values(userAnswerData);
        if (correctAnswers && correctAnswers.length === userValues.length) {
          return correctAnswers.every((a, idx) => 
            normalizeString(String(userValues[idx])) === normalizeString(a.text)
          );
        }
        
        return false;
      }
      
      case 'correspondance': {
        // Pour les correspondances
        if (typeof userAnswerData !== 'object') return false;
        
        if (Array.isArray(userAnswerData)) {
          // Format array (leftId-rightId)
          return userAnswerData.every(id => {
            if (typeof id !== 'string' || !id.includes('-')) return false;
            
            const [leftId, rightId] = id.split('-');
            const leftItem = question.answers?.find(a => a.id === leftId);
            const rightItem = question.answers?.find(a => a.id === rightId);
            
            return leftItem && rightItem && leftItem.match_pair === rightItem.text;
          });
        } else {
          // Format objet {leftId: rightValue}
          return Object.entries(userAnswerData).every(([leftId, rightValue]) => {
            if (leftId === 'destination') return true;
            
            const leftItem = question.answers?.find(a => a.id === leftId);
            return leftItem && leftItem.match_pair === rightValue;
          });
        }
      }
      
      case 'rearrangement': {
        // Pour le réarrangement, vérifier l'ordre
        if (!Array.isArray(userAnswerData)) return false;
        
        const correctOrder = [...(question.answers || [])].sort((a, b) => 
          (a.position || 0) - (b.position || 0)
        ).map(a => a.id);
        
        return JSON.stringify(userAnswerData) === JSON.stringify(correctOrder);
      }
      
      case 'carte flash': {
        // Pour les flashcards
        const correctAnswer = question.answers?.find(a => a.isCorrect || a.is_correct === 1);
        return correctAnswer && (correctAnswer.text === userAnswerData || correctAnswer.id === String(userAnswerData));
      }
      
      // case 'vrai/faux': {
      //   // Pour les questions vrai/faux
      //   const correctAnswerIds = question.answers
      //     ?.filter(a => a.isCorrect || a.is_correct === 1)
      //     .map(a => a.id);
          
      //   return correctAnswerIds?.includes(String(userAnswerData));
      // }
      
      case 'banque de mots': {
        // Pour banque de mots
        if (!Array.isArray(userAnswerData)) return false;
        
        const correctAnswerIds = question.answers
          ?.filter(a => a.isCorrect || a.is_correct === 1)
          .map(a => a.id);
        
        if (!correctAnswerIds?.length) return false;
        
        // Vérifier que tous les mots corrects ont été sélectionnés et aucun incorrect
        const selectedIds = userAnswerData.map(id => String(id));
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
            
            if (Array.isArray(userAnswerData)) {
              // Convertir tous les éléments en string pour la comparaison
              const normalizedUserAnswers = userAnswerData.map(id => String(id));
              return correctIds.length === normalizedUserAnswers.length && 
                     correctIds.every(id => normalizedUserAnswers.includes(id));
            } else {
              return correctIds.includes(String(userAnswerData));
            }
          }
          return false;
        }
        
        if (Array.isArray(userAnswerData)) {
          // Si plusieurs réponses sont attendues (QCM multi)
          // Convertir tous les éléments en string pour la comparaison
          const normalizedUserAnswers = userAnswerData.map(id => String(id));
          return correctAnswerIds.length === normalizedUserAnswers.length && 
                 correctAnswerIds.every(id => normalizedUserAnswers.includes(id));
        } else {
          // Si une seule réponse est attendue (QCM simple)
          return correctAnswerIds.includes(String(userAnswerData));
        }
      }
    }
  };

  return (
    <div className="space-y-6 mb-10">
      <div className="flex items-center gap-4 flex-wrap">
        <Button 
          variant="outline" 
          onClick={() => navigate('/quizzes')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">{quiz.titre || "Quiz"}</h1>
      </div>
      
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Résumé du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={cn(
                "text-4xl font-bold rounded-full h-24 w-24 flex items-center justify-center",
                score >= 70 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
              )}>
                {score}%
              </div>
            </div>
            <div>
              <Badge className={cn(
                score >= 70 ? "bg-green-500" : "bg-amber-500"
              )}>
                {successLevel}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {score === 100 ? "Félicitations ! Score parfait!" : 
               score >= 80 ? "Excellent travail !" :
               score >= 60 ? "Bien joué !" :
               "Continuez à vous entraîner !"}
            </p>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-400px)] md:h-auto">
        <div className="space-y-4 p-1">
          <h2 className="text-xl font-bold">Détails des réponses</h2>
          
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = isAnswerCorrect(question);

            return (
              <Card key={question.id} className={cn(
                "border-l-4",
                isCorrect ? "border-l-green-500" : "border-l-red-500"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <CardTitle className="text-base md:text-lg">
                      Question {index + 1}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-base md:text-lg font-medium">{question.text}</p>
                  
                  {question.media_url && (
                    <div className="flex justify-center my-4">
                      {question.type === 'question audio' ? (
                        <div className="w-full max-w-md">
                          <audio controls className="w-full">
                            <source 
                              src={question.media_url.startsWith('http') ? 
                                question.media_url : 
                                `${import.meta.env.VITE_API_URL}/${question.media_url}`} 
                              type="audio/mpeg" 
                            />
                            Votre navigateur ne supporte pas l'élément audio.
                          </audio>
                        </div>
                      ) : (
                        <img
                          src={question.media_url.startsWith('http') ? 
                            question.media_url : 
                            `${import.meta.env.VITE_API_URL}/${question.media_url}`}
                          alt="Question media"
                          className="max-w-full h-auto rounded"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Votre réponse :
                    </p>
                    <div className={cn(
                      "p-3 rounded-lg text-sm md:text-base",
                      isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    )}>
                      {userAnswer ? formatAnswer(question, userAnswer) : "Aucune réponse"}
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Bonne réponse :
                      </p>
                      <div className="p-3 rounded-lg bg-green-50 text-green-800 text-sm md:text-base">
                        {formatCorrectAnswer(question)}
                      </div>
                    </div>
                  )}
                  
                  {question.explication && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Explication :
                      </p>
                      <Alert className="p-3 bg-blue-50 text-blue-800 text-sm md:text-base border-blue-200">
                        {question.explication}
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="flex justify-center mt-6 gap-4 flex-wrap">
        <Button onClick={() => navigate('/quizzes')} variant="outline">
          Retour à la liste des quiz
        </Button>
        <Button onClick={() => navigate(`/quiz/${quiz.id}`)}>
          Recommencer
        </Button>
      </div>
    </div>
  );
}
