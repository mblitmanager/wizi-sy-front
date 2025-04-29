
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface QuizSummaryProps {
  quiz: Quiz;
  questions: Question[];
  userAnswers: Record<string, any>;
  score: number;
  totalQuestions: number;
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
      case 'remplir le champ vide':
        // Pour les questions fillblank, les réponses sont un objet de type { blank_1: "valeur" }
        if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
          return Object.entries(userAnswer)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
        return String(userAnswer);
      
      case 'correspondance':
        // Pour les questions matching, on affiche les paires
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
      
      case 'carte flash':
        // Pour les cartes flash, on retourne directement la valeur
        return String(userAnswer);
        
      default:
        // Pour les autres types de questions (QCM, vrai/faux, etc.)
        if (Array.isArray(userAnswer)) {
          return userAnswer.map(id => {
            const answer = question.answers?.find(a => a.id === id);
            return answer?.text || id;
          }).join(', ');
        }
        // Si c'est une réponse unique comme vrai/faux
        const answer = question.answers?.find(a => a.id === userAnswer);
        return answer ? answer.text : String(userAnswer);
    }
  };

  const formatCorrectAnswer = (question: Question) => {
    switch (question.type) {
      case 'remplir le champ vide':
        // Trouver les réponses avec bank_group défini
        const blanks = question.answers?.filter(a => a.bank_group && a.isCorrect);
        if (blanks && blanks.length) {
          return blanks.map(b => `${b.bank_group}: ${b.text}`).join(', ');
        }
        return "Aucune réponse correcte définie";
      
      case 'correspondance':
        // Pour les questions matching, trouver les paires correctes
        const matchingAnswers = question.answers?.filter(a => a.match_pair);
        if (matchingAnswers && matchingAnswers.length) {
          return matchingAnswers.map(a => `${a.text} → ${a.match_pair}`).join('; ');
        }
        return "Aucune réponse correcte définie";
      
      case 'carte flash':
        // Pour les cartes flash, trouver la réponse correcte
        const flashcard = question.answers?.find(a => a.isCorrect || a.is_correct);
        if (flashcard) {
          return `${flashcard.text} (${flashcard.flashcard_back || 'Pas de détails'})`;
        }
        return "Aucune réponse correcte définie";
        
      case 'rearrangement':
        // Pour les questions d'arrangement, ordonner par position
        const orderedAnswers = [...(question.answers || [])].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        );
        return orderedAnswers.map((a, i) => `${i + 1}. ${a.text}`).join(', ');
        
      default:
        // Pour les QCM et vrai/faux, trouver les réponses correctes
        const correctAnswers = question.answers?.filter(a => a.isCorrect || a.is_correct);
        return correctAnswers?.map(a => a.text).join(', ') || "Aucune réponse correcte définie";
    }
  };

  const isAnswerCorrect = (question: Question, userAnswerData: any): boolean => {
    if (question.isCorrect !== undefined) {
      // Si la question fournit déjà l'information
      return question.isCorrect;
    }
    
    if (!userAnswerData) return false;
    
    switch (question.type) {
      case 'remplir le champ vide': {
        // Pour les questions à blancs, vérifier chaque champ
        if (typeof userAnswerData !== 'object' || Array.isArray(userAnswerData)) return false;
        
        const blankAnswers = question.answers?.filter(a => a.bank_group && a.isCorrect);
        if (!blankAnswers) return false;
        
        return Object.entries(userAnswerData).every(([key, value]) => {
          const correctAnswer = blankAnswers.find(a => a.bank_group === key);
          return correctAnswer && String(value).toLowerCase() === correctAnswer.text.toLowerCase();
        });
      }
      
      case 'correspondance': {
        // Pour les correspondances
        if (!Array.isArray(userAnswerData)) return false;
        
        return userAnswerData.every(id => {
          if (typeof id !== 'string' || !id.includes('-')) return false;
          
          const [leftId, rightId] = id.split('-');
          const leftItem = question.answers?.find(a => a.id === leftId);
          const rightItem = question.answers?.find(a => a.id === rightId);
          
          return leftItem && rightItem && leftItem.match_pair === rightItem.text;
        });
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
        const correctAnswer = question.answers?.find(a => a.isCorrect || a.is_correct);
        return correctAnswer && correctAnswer.text === userAnswerData;
      }
      
      default: {
        // Pour QCM, vrai/faux
        const correctAnswerIds = question.answers
          ?.filter(a => a.isCorrect || a.is_correct)
          .map(a => a.id);
        
        if (!correctAnswerIds?.length) return false;
        
        if (Array.isArray(userAnswerData)) {
          // Si plusieurs réponses sont attendues (QCM multi)
          return JSON.stringify(userAnswerData.sort()) === JSON.stringify(correctAnswerIds.sort());
        } else {
          // Si une seule réponse est attendue (vrai/faux, QCM simple)
          return correctAnswerIds.includes(userAnswerData);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Détails des réponses</h2>
        
        {questions.map((question, index) => {
          const questionId = question.id.toString();
          const userAnswer = userAnswers[questionId];
          const isCorrect = isAnswerCorrect(question, userAnswer);

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
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <p className="text-lg font-medium">{question.text}</p>
                
                {question.media_url && (
                  <div className="flex justify-center mb-4">
                    {question.type === 'question audio' ? (
                      <div className="w-full max-w-md">
                        <audio controls className="w-full">
                          <source src={question.media_url} type="audio/mpeg" />
                          Votre navigateur ne supporte pas l'élément audio.
                        </audio>
                      </div>
                    ) : (
                      <img
                        src={question.media_url}
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
                    "p-3 rounded-lg",
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
                    <div className="p-3 rounded-lg bg-green-50 text-green-800">
                      {formatCorrectAnswer(question)}
                    </div>
                  </div>
                )}
                
                {question.explication && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Explication :
                    </p>
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-800">
                      {question.explication}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-6 gap-4">
        <Button onClick={() => navigate('/quizzes')} variant="outline">
          Retour à la liste des quiz
        </Button>
        <Button onClick={() => navigate(`/quiz/${quiz.id}`)}>
          Détails du quiz
        </Button>
      </div>
    </div>
  );
}
