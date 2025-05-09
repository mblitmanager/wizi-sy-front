import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import scoreparfait from "@/assets/icons/bombe-de-table.png";
import scoreexcellent from "@/assets/icons/applaudissements.png";
import scorebien from "@/assets/icons/pouces-vers-le-haut.png";
import scoremoyen from "@/assets/icons/des-astuces.png";

interface QuizSummaryProps {
  quiz: Quiz;
  questions: Question[];
  userAnswers: Record<
    string,
    | string
    | number
    | Record<string, string | number>
    | Array<string | number>
    | null
    | undefined
  >;
  score: number;
  totalQuestions: number;
}

// Fonction utilitaire pour normaliser les chaînes (accents, casse, espaces)
function normalizeString(str: string): string {
  return str
    .normalize("NFD") // décompose les accents
    .replace(/\u0300-\u036f/g, "") // supprime les diacritiques
    .toLowerCase()
    .trim();
}

export function QuizSummary({
  quiz,
  questions,
  userAnswers,
  score,
  totalQuestions,
}: QuizSummaryProps) {
  const navigate = useNavigate();

  // Calculer le niveau de réussite
  const successLevel =
    score >= 80
      ? "Excellent"
      : score >= 70
      ? "Très bien"
      : score >= 60
      ? "Bien"
      : score >= 50
      ? "Moyen"
      : "À améliorer";

  const formatAnswer = (
    question: Question,
    userAnswer:
      | string
      | number
      | Record<string, string | number>
      | Array<string | number>
      | null
      | undefined
  ) => {
    if (!userAnswer) return "Aucune réponse";

    switch (question.type) {
      case "remplir le champ vide": {
        if (typeof userAnswer === "object" && !Array.isArray(userAnswer)) {
          return (
            Object.values(userAnswer)
              .map((val) => {
                const found = question.answers?.find(
                  (a) =>
                    normalizeString(a.text) === normalizeString(String(val))
                );
                return found ? found.text : val;
              })
              .join(", ") || "Aucune réponse"
          );
        }
        const found = question.answers?.find(
          (a) => normalizeString(a.text) === normalizeString(String(userAnswer))
        );
        return found ? found.text : String(userAnswer);
      }

      case "correspondance": {
        if (typeof userAnswer === "object" && !Array.isArray(userAnswer)) {
          const pairs = [];
          for (const leftId in userAnswer) {
            if (leftId !== "destination") {
              const rightValue = userAnswer[leftId];
              const leftItem = question.answers?.find((a) => a.id === leftId);
              const rightItem = question.answers?.find(
                (a) => a.text === String(rightValue)
              );
              pairs.push(
                `${leftItem?.text || leftId} : ${rightItem?.text || rightValue}`
              );
            }
          }
          return pairs.join("; ") || "Aucune réponse";
        }
        if (Array.isArray(userAnswer)) {
          return userAnswer
            .map((id) => {
              if (typeof id === "string" && id.includes("-")) {
                const [leftId, rightId] = id.split("-");
                const leftItem = question.answers?.find((a) => a.id === leftId);
                const rightItem = question.answers?.find(
                  (a) => a.id === rightId
                );
                return `${leftItem?.text || leftId} : ${
                  rightItem?.text || rightId
                }`;
              }
              return id;
            })
            .join("; ");
        }
        console.log("userAnswer formatAnswer", userAnswer);
        return String(userAnswer);
      }

      case "carte flash": {
        let value = userAnswer;
        if (
          userAnswer &&
          typeof userAnswer === "object" &&
          "selectedAnswers" in userAnswer
        ) {
          value = userAnswer.selectedAnswers;
        }
        if (Array.isArray(value)) {
          value = value[0];
        }
        if (question.answers) {
          const answer = question.answers.find(
            (a) =>
              a.id === String(value) ||
              normalizeString(a.text) === normalizeString(String(value))
          );
          return answer ? answer.text : String(value);
        }
        return String(value);
      }

      case "vrai/faux": {
        const answer = question.answers?.find(
          (a) => a.id === String(userAnswer)
        );
        return answer ? answer.text : String(userAnswer);
      }

      case "rearrangement": {
        if (Array.isArray(userAnswer)) {
          return userAnswer
            .map((id, index) => {
              const answer = question.answers?.find((a) => a.id === String(id));
              return `${index + 1}. ${answer?.text || id}`;
            })
            .join(", ");
        }
        return String(userAnswer);
      }

      case "question audio": {
        if (
          typeof userAnswer === "object" &&
          "id" in userAnswer &&
          "text" in userAnswer
        ) {
          return userAnswer.text;
        }
        return "Aucune réponse";
      }

      default: {
        if (Array.isArray(userAnswer)) {
          const answerTexts = userAnswer.map((id) => {
            const answer = question.answers?.find((a) => a.id === String(id));
            return answer?.text || id;
          });
          return answerTexts.join(", ") || "Aucune réponse";
        }
        const answer = question.answers?.find(
          (a) => a.id === String(userAnswer)
        );
        return answer ? answer.text : String(userAnswer);
      }
    }
  };

  const formatCorrectAnswer = (question: Question) => {
    switch (question.type) {
      case "remplir le champ vide": {
        const blanks: Record<string, string> = {};
        question.answers?.forEach((a) => {
          if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
            blanks[a.bank_group] = a.text;
          }
        });

        if (Object.keys(blanks).length > 0) {
          return Object.values(blanks).join(", ");
        }

        const correctFillAnswers = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );
        if (correctFillAnswers && correctFillAnswers.length) {
          return correctFillAnswers.map((a) => a.text).join(", ");
        }

        if (question.correctAnswers && question.correctAnswers.length) {
          const answerTexts = question.correctAnswers.map((id) => {
            const answer = question.answers?.find(
              (a) => a.id === String(id) || a.id === id
            );
            return answer ? answer.text : id;
          });
          return answerTexts.join(", ");
        }

        return "Aucune réponse correcte définie";
      }

      case "correspondance": {
        if (!question.selectedAnswers || !question.answers) {
          return "Aucune réponse correcte définie";
        }
        const pairs = Object.entries(question.selectedAnswers).map(
          ([leftId, rightText]) => {
            // Trouver l'élément correspondant à `leftId`
            const leftItem = question.answers.find(
              (a) => parseInt(a.id) === parseInt(leftId)
            );
            return `${leftItem?.text || leftId} : ${rightText}`;
          }
        );
        console.log("pairs formatCorrectAnswer", pairs);

        return pairs.length > 0
          ? pairs.join("; ")
          : "Aucune réponse correcte définie";
      }

      case "carte flash": {
        const flashcard = question.answers?.find(
          (a) => a.isCorrect || a.is_correct === 1
        );
        if (flashcard) {
          return `${flashcard.text}${
            flashcard.flashcard_back ? ` (${flashcard.flashcard_back})` : ""
          }`;
        }
        return "Aucune réponse correcte définie";
      }

      case "rearrangement": {
        const orderedAnswers = [...(question.answers || [])].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        );
        return orderedAnswers.map((a, i) => `${i + 1}. ${a.text}`).join(", ");
      }

      case "banque de mots": {
        const correctWords = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );
        if (correctWords && correctWords.length) {
          return correctWords.map((a) => a.text).join(", ");
        }
        return "Aucune réponse correcte définie";
      }

      default: {
        const correctAnswers = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );
        if (correctAnswers && correctAnswers.length) {
          return correctAnswers.map((a) => a.text).join(", ");
        }

        if (question.correctAnswers && question.correctAnswers.length) {
          const answerTexts = question.correctAnswers.map((id) => {
            const answer = question.answers?.find(
              (a) => a.id === String(id) || a.id === id
            );
            return answer ? answer.text : id;
          });
          return answerTexts.join(", ");
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
      case "remplir le champ vide": {
        // Pour les questions à blancs, vérifier chaque champ
        if (typeof userAnswerData !== "object" || Array.isArray(userAnswerData))
          return false;

        const correctBlanks = {};
        question.answers?.forEach((a) => {
          if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
            correctBlanks[a.bank_group] = a.text;
          }
        });

        // Cas classique avec bank_group
        if (Object.keys(correctBlanks).length > 0) {
          return Object.entries(userAnswerData).every(([key, value]) => {
            const correctAnswer = correctBlanks[key];
            if (!correctAnswer) return false;
            return (
              normalizeString(String(value)) === normalizeString(correctAnswer)
            );
          });
        }

        // Cas sans bank_group, plusieurs champs à remplir
        const correctAnswers = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );
        const userValues = Object.values(userAnswerData);
        if (correctAnswers && correctAnswers.length === userValues.length) {
          return correctAnswers.every(
            (a, idx) =>
              normalizeString(String(userValues[idx])) ===
              normalizeString(a.text)
          );
        }

        return false;
      }

      case "correspondance": {
        console.log("userAnswerData dans isAnswerCorrect", userAnswerData);

        if (
          typeof userAnswerData !== "object" ||
          Array.isArray(userAnswerData)
        ) {
          return false;
        }

        // Mapping des IDs vers les textes
        const idToText = Object.fromEntries(
          (question.answers || []).map((a) => [a.id, a.text])
        );

        console.log("idToText", idToText);

        // Mapping des match_pair vers les textes
        const matchPairToText = Object.fromEntries(
          (question.isCorrect?.match_pair || []).map(({ text, match_pair }) => [
            match_pair,
            text,
          ])
        );

        console.log("matchPairToText", matchPairToText);

        // Générer les paires dans le format "France : Paris"
        const pairs = Object.entries(question.selectedAnswers).map(
          ([leftId, rightText]) => {
            const leftText = idToText[leftId] || leftId;
            const rightTextFormatted = matchPairToText[rightText] || rightText;
            return `${leftText} : ${rightTextFormatted}`;
          }
        );

        console.log("pairs formatCorrectAnswer", pairs);

        return pairs.length > 0
          ? pairs.join("; ")
          : "Aucune réponse correcte définie";
      }

      case "rearrangement": {
        // Pour le réarrangement, vérifier l'ordre
        if (!Array.isArray(userAnswerData)) return false;

        const correctOrder = [...(question.answers || [])]
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((a) => a.id);

        return JSON.stringify(userAnswerData) === JSON.stringify(correctOrder);
      }

      case "carte flash": {
        // Pour les flashcards
        const correctAnswer = question.answers?.find(
          (a) => a.isCorrect || a.is_correct === 1
        );
        return (
          correctAnswer &&
          (correctAnswer.text === userAnswerData ||
            correctAnswer.id === String(userAnswerData))
        );
      }

      case "banque de mots": {
        // Pour banque de mots
        if (!Array.isArray(userAnswerData)) return false;

        const correctAnswerIds = question.answers
          ?.filter((a) => a.isCorrect || a.is_correct === 1)
          .map((a) => a.id);

        if (!correctAnswerIds?.length) return false;

        // Vérifier que tous les mots corrects ont été sélectionnés et aucun incorrect
        const selectedIds = userAnswerData.map((id) => String(id));
        return (
          correctAnswerIds.every((id) => selectedIds.includes(String(id))) &&
          selectedIds.every((id) => correctAnswerIds.includes(String(id)))
        );
      }

      default: {
        // Pour QCM
        const correctAnswerIds = question.answers
          ?.filter((a) => a.isCorrect || a.is_correct === 1)
          .map((a) => a.id);

        if (!correctAnswerIds?.length) {
          // Tenter d'utiliser correctAnswers si disponible
          if (question.correctAnswers && question.correctAnswers.length) {
            const correctIds = question.correctAnswers.map((id) => String(id));

            if (Array.isArray(userAnswerData)) {
              // Convertir tous les éléments en string pour la comparaison
              const normalizedUserAnswers = userAnswerData.map((id) =>
                String(id)
              );
              return (
                correctIds.length === normalizedUserAnswers.length &&
                correctIds.every((id) => normalizedUserAnswers.includes(id))
              );
            } else {
              return correctIds.includes(String(userAnswerData));
            }
          }
          return false;
        }

        if (Array.isArray(userAnswerData)) {
          // Si plusieurs réponses sont attendues (QCM multi)
          // Convertir tous les éléments en string pour la comparaison
          const normalizedUserAnswers = userAnswerData.map((id) => String(id));
          return (
            correctAnswerIds.length === normalizedUserAnswers.length &&
            correctAnswerIds.every((id) => normalizedUserAnswers.includes(id))
          );
        } else {
          // Si une seule réponse est attendue (QCM simple)
          return correctAnswerIds.includes(String(userAnswerData));
        }
      }
    }
  };

  return (
    <div className="space-y-6 px-3 py-6 sm:px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/quizzes")}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shadow-sm hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {quiz.titre || "Quiz"}
        </h1>
      </div>

      {/* Résumé du Quiz */}
      <Card className="bg-gradient-to-br from-slate-100 to-slate-300 border-none shadow-md rounded-xl p-4 sm:p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-lg sm:text-xl text-primary font-semibold">
            Résumé du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={cn(
                  "text-2xl sm:text-4xl font-extrabold rounded-full h-24 sm:h-32 w-24 sm:w-32 flex items-center justify-center shadow-lg border-4 transition-transform duration-300",
                  score >= 70
                    ? "bg-green-100 text-green-700 border-green-400"
                    : "bg-amber-100 text-amber-700 border-amber-400"
                )}>
                {score}%
              </div>
            </div>

            <Badge
              className={cn(
                "px-3 py-1 text-sm rounded-full shadow-md transition-all duration-300",
                score >= 70
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 text-white"
              )}>
              {successLevel}
            </Badge>

            <div className="flex flex-col items-center gap-2">
              {score === 100 ? (
                <img src={scoreparfait} className="w-12 sm:w-16" alt="" />
              ) : score >= 80 ? (
                <img src={scoreexcellent} className="w-12 sm:w-16" alt="" />
              ) : score >= 60 ? (
                <img src={scorebien} className="w-12 sm:w-16" alt="" />
              ) : (
                <img src={scoremoyen} className="w-12 sm:w-16" alt="" />
              )}
              <p className="text-sm sm:text-lg text-muted-foreground font-medium">
                {score === 100
                  ? "Félicitations ! Score parfait!"
                  : score >= 80
                  ? "Excellent travail !"
                  : score >= 60
                  ? "Bien joué !"
                  : "Continuez à vous entraîner !"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails des réponses */}
      <ScrollArea className="h-[calc(100vh-350px)] sm:h-auto">
        <div className="space-y-4 p-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Détails des réponses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = isAnswerCorrect(question);
              console.log("question", question);
              console.log(isCorrect);
              return (
                <Card
                  key={question.id}
                  className={cn(
                    "border-l-4 rounded-lg shadow-sm p-4 space-y-3",
                    isCorrect ? "border-green-500" : "border-red-500"
                  )}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <h3 className="text-sm sm:text-base font-semibold">
                      Question {index + 1}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-700">{question.text}</p>

                  {question.media_url && (
                    <div className="flex justify-center">
                      {question.type === "question audio" ? (
                        <audio controls className="w-full sm:w-auto rounded-lg">
                          <source src={question.media_url} type="audio/mpeg" />
                          Votre navigateur ne supporte pas l'élément audio.
                        </audio>
                      ) : (
                        <img
                          src={question.media_url}
                          alt="Question media"
                          className="w-full sm:w-auto h-auto rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-semibold">Votre réponse :</span>{" "}
                    {userAnswer
                      ? formatAnswer(question, userAnswer)
                      : "Aucune réponse"}
                  </div>

                  {!isCorrect && (
                    <div className="text-sm">
                      <span className="font-semibold">Bonne réponse :</span>{" "}
                      {formatCorrectAnswer(question)}
                    </div>
                  )}

                  {question.explication && (
                    <Alert className="text-sm bg-blue-50 text-blue-800 border border-blue-200 p-2">
                      {question.explication}
                    </Alert>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Footer buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        <Button
          onClick={() => navigate("/quizzes")}
          variant="outline"
          className="flex-1 min-w-[110px] px-4 py-2 text-sm rounded-full hover:bg-muted transition">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>

        <Button
          onClick={() => navigate(`/quiz/${quiz.id}`)}
          className="flex-1 min-w-[110px] px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Recommencer
        </Button>

        <Button
          onClick={() => navigate(`/classement`)}
          variant="outline"
          className="flex-1 min-w-[110px] px-4 py-2 text-sm rounded-full hover:bg-muted transition">
          <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1" />
          Classement
        </Button>
      </div>
    </div>
  );
}
