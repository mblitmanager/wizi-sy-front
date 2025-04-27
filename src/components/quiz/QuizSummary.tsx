import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Quiz, QuestionType } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface QuizSummaryProps {
  quiz: Quiz;
  questions: Question[];
  userAnswers: Record<string, string[]>;
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

  const formatAnswer = (question: Question, userAnswerIds: string[]) => {
    switch (question.type) {
      case 'remplir le champ vide':
        // Pour les questions fillblank, on affiche directement les réponses
        return userAnswerIds.join(', ');
      
      case 'correspondance':
        // Pour les questions matching, on affiche les paires
        const pairs = userAnswerIds.map(id => {
          const [leftId, rightId] = id.split('-');
          const leftItem = question.matching?.find(r => r.id === leftId);
          const rightItem = question.matching?.find(r => r.id === rightId);
          return `${leftItem?.text} → ${rightItem?.text}`;
        });
        return pairs.join('; ');
      
      default:
        // Pour les autres types de questions
        return userAnswerIds.map(id => {
          const answer = question.answers?.find(a => a.id === id);
          return answer?.text || id;
        }).join(', ');
    }
  };

  const formatCorrectAnswer = (question: Question) => {
    switch (question.type) {
      case 'remplir le champ vide':
        // Pour les questions fillblank, on affiche les réponses correctes
        return question.blanks?.map(b => b.text).join(', ') || "Aucune réponse correcte définie";
      
      case 'correspondance':
        // Pour les questions matching, on affiche les paires correctes
        const pairs = question.matching?.map(r => `${r.text} → ${r.matchPair}`) || [];
        return pairs.join('; ') || "Aucune réponse correcte définie";
      
      default:
        // Pour les autres types de questions
        const correctAnswers = question.answers?.filter(a => a.isCorrect || a.reponse_correct) || [];
        return correctAnswers.map(a => a.text).join(', ') || "Aucune réponse correcte définie";
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
          const userAnswerIds = userAnswers[question.id] || [];
          const isCorrect = question.isCorrect !== undefined 
            ? question.isCorrect 
            : question.type === 'correspondance'
              ? userAnswerIds.every(id => {
                  const [leftId, rightId] = id.split('-');
                  const leftItem = question.matching?.find(r => r.id === leftId);
                  const rightItem = question.matching?.find(r => r.id === rightId);
                  return leftItem?.matchPair === rightItem?.text;
                })
              : question.type === 'remplir le champ vide'
                ? userAnswerIds.every((answer, i) => {
                    const correctAnswer = question.blanks?.[i]?.text;
                    return answer.toLowerCase() === correctAnswer?.toLowerCase();
                  })
                : JSON.stringify(userAnswerIds.sort()) === JSON.stringify(
                    question.answers?.filter(a => a.isCorrect || a.reponse_correct)
                      .map(a => a.id).sort() || []
                  );

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
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Votre réponse :
                  </p>
                  <div className={cn(
                    "p-3 rounded-lg",
                    isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  )}>
                    {userAnswerIds.length > 0 ? formatAnswer(question, userAnswerIds) : "Aucune réponse"}
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
