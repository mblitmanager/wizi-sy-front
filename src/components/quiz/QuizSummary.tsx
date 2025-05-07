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
                // Cherche une réponse correspondante dans answers
                const found = question.answers?.find(
                  (a) =>
                    normalizeString(a.text) === normalizeString(String(val))
                );
                return found ? found.text : val;
              })
              .join(", ") || "Aucune réponse"
          );
        }
        // Cas fallback
        const found = question.answers?.find(
          (a) => normalizeString(a.text) === normalizeString(String(userAnswer))
        );
        return found ? found.text : String(userAnswer);
      }

      case "correspondance": {
        // Pour les questions matching, on affiche les paires
        if (typeof userAnswer === "object" && !Array.isArray(userAnswer)) {
          const pairs = [];
          for (const leftId in userAnswer) {
            if (leftId !== "destination") {
              const rightValue = userAnswer[leftId];
              const leftItem = question.answers?.find((a) => a.id === leftId);
              const rightItem = question.answers?.find(
                (a) => a.id === String(rightValue)
              );
              pairs.push(
                `${leftItem?.text || leftId} → ${rightItem?.text || rightValue}`
              );
            }
          }
          return pairs.join("; ") || "Aucune réponse";
        }

        // Format alternatif (array)
        if (Array.isArray(userAnswer)) {
          return userAnswer
            .map((id) => {
              if (typeof id === "string" && id.includes("-")) {
                const [leftId, rightId] = id.split("-");
                const leftItem = question.answers?.find((a) => a.id === leftId);
                const rightItem = question.answers?.find(
                  (a) => a.id === rightId
                );
                return `${leftItem?.text || leftId} → ${
                  rightItem?.text || rightId
                }`;
              }
              return id;
            })
            .join("; ");
        }

        return String(userAnswer);
      }

      case "carte flash": {
        // Pour les cartes flash, retourner le texte de la réponse
        let value = userAnswer;
        // Si la réponse est un objet avec selectedAnswers, on l'utilise
        if (
          userAnswer &&
          typeof userAnswer === "object" &&
          "selectedAnswers" in userAnswer
        ) {
          value = userAnswer.selectedAnswers;
        }
        // Si c'est un tableau, on prend le premier élément
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
        // Pour les questions vrai/faux, on affiche le texte de la réponse
        const answer = question.answers?.find(
          (a) => a.id === String(userAnswer)
        );
        return answer ? answer.text : String(userAnswer);
      }

      case "rearrangement": {
        // Pour les questions d'ordre, afficher les étapes dans l'ordre soumis
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

      default: {
        // Pour les autres types de questions (QCM, etc.)
        if (Array.isArray(userAnswer)) {
          const answerTexts = userAnswer.map((id) => {
            const answer = question.answers?.find((a) => a.id === String(id));
            return answer?.text || id;
          });
          return answerTexts.join(", ") || "Aucune réponse";
        }
        console.log("user anwerquestion");
        console.log(userAnswer);
        // Si c'est une réponse unique
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
        const leftItems = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );

        const pairCount = leftItems?.length ?? 0;
        const half = Math.floor(pairCount / 2);
        const left = leftItems?.slice(0, half) ?? [];
        const right = leftItems?.slice(half) ?? [];
        console.log("right", right);
        console.log("left", left);

        const pairs = left.map((leftItem, index) => {
          const rightItem = right[index];
          return `${leftItem.text} → ${rightItem?.text ?? "?"}`;
        });

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
        if (typeof userAnswerData !== "object") return false;

        const answersById = Object.fromEntries(
          (question.answers || []).map((a) => [String(a.id), a])
        );

        if (Array.isArray(userAnswerData)) {
          // Format tableau ["leftId-rightId"]
          return userAnswerData.every((pairStr) => {
            if (typeof pairStr !== "string" || !pairStr.includes("-"))
              return false;

            const [leftId, rightId] = pairStr.split("-");
            const leftItem = answersById[leftId];
            const rightItem = answersById[rightId];

            if (!leftItem || !rightItem) return false;

            // match_pair peut être soit un ID (string/number) soit le texte directement
            return (
              leftItem.match_pair === rightItem.id ||
              leftItem.match_pair === rightItem.text
            );
          });
        } else {
          // Format objet {leftId: rightText}
          return Object.entries(userAnswerData).every(([leftId, rightText]) => {
            if (leftId === "destination") return true;

            const leftItem = answersById[leftId];
            if (!leftItem) return false;

            const expectedRightItem = question.answers?.find(
              (a) =>
                a.id === leftItem.match_pair ||
                a.text === leftItem.match_pair ||
                String(a.id) === String(leftItem.match_pair)
            );

            return (
              expectedRightItem &&
              normalizeString(String(rightText)) ===
                normalizeString(expectedRightItem.text)
            );
          });
        }
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
    <div className="space-y-10 px-4  py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/quizzes")}
          className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {quiz.titre || "Quiz"}
        </h1>
      </div>

      {/* Résumé du Quiz */}
      <Card className="bg-gradient-to-br from-slate-100 to-slate-300 border-none shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary font-semibold">
            Résumé du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div
                className={cn(
                  "text-4xl font-extrabold rounded-full h-32 w-32 flex items-center justify-center shadow-lg transform transition-transform duration-500 border-4",
                  score >= 70
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 border-green-400 scale-110"
                    : "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border-amber-400 scale-100"
                )}
              >
                {score}%
              </div>
            </div>
            <Badge
              className={cn(
                "px-4 py-2 text-sm rounded-full shadow-md transform transition-all duration-500",
                score >= 70
                  ? "bg-green-500 text-white hover:scale-105"
                  : "bg-amber-500 text-white hover:scale-105"
              )}
            >
              {successLevel}
            </Badge>
            <p className="text-lg text-muted-foreground font-medium flex items-center justify-center space-x-2">
              {score === 100 ? (
                <>
                  <span className="text-2xl">
                    <img src={scoreparfait} className="w-16" alt="" />
                  </span>
                  <h2>Félicitations ! Score parfait!</h2>
                </>
              ) : score >= 80 ? (
                <>
                  <span className="text-2xl">
                    <img src={scoreexcellent} className="w-16" alt="" />
                  </span>
                  <h2>Excellent travail !</h2>
                </>
              ) : score >= 60 ? (
                <>
                  <span className="text-2xl">
                    <img src={scorebien} className="w-16" alt="" />
                  </span>
                  <h2>Bien joué !</h2>
                </>
              ) : (
                <>
                  <span className="text-2xl">
                    <img src={scoremoyen} alt="" className="w-16" />
                  </span>
                  <h2>Continuez à vous entraîner !</h2>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Détails des réponses */}
      <ScrollArea className="h-[calc(100vh-400px)] md:h-auto">
        <div className="space-y-6 p-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Détails des réponses
          </h2>

          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = isAnswerCorrect(question);

            return (
              <Card
                key={question.id}
                className={cn(
                  "border-l-4 rounded-xl shadow-sm transition-all",
                  isCorrect ? "border-l-green-500" : "border-l-red-500"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <CardTitle className="text-base md:text-lg text-gray-700">
                      Question {index + 1}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-lg font-medium text-gray-800">
                    {question.text}
                  </p>

                  {question.media_url && (
                    <div className="flex justify-center my-4">
                      {question.type === "question audio" ? (
                        <div className="w-full max-w-md">
                          <audio controls className="w-full rounded-lg">
                            <source
                              src={
                                question.media_url.startsWith("http")
                                  ? question.media_url
                                  : `${import.meta.env.VITE_API_URL}/${
                                      question.media_url
                                    }`
                              }
                              type="audio/mpeg"
                            />
                            Votre navigateur ne supporte pas l'élément audio.
                          </audio>
                        </div>
                      ) : (
                        <img
                          src={
                            question.media_url.startsWith("http")
                              ? question.media_url
                              : `${import.meta.env.VITE_API_URL}/${
                                  question.media_url
                                }`
                          }
                          alt="Question media"
                          className="max-w-full h-auto rounded-xl shadow-md"
                        />
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Votre réponse :
                    </p>
                    <div
                      className={cn(
                        "p-3 rounded-lg text-base font-semibold",
                        isCorrect
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      )}
                    >
                      {userAnswer
                        ? formatAnswer(question, userAnswer)
                        : "Aucune réponse"}
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Bonne réponse :
                      </p>
                      <div className="p-3 rounded-lg bg-green-50 text-green-800 text-base border border-green-200">
                        {formatCorrectAnswer(question)}
                      </div>
                    </div>
                  )}

                  {question.explication && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Explication :
                      </p>
                      <Alert className="p-3 bg-blue-50 text-blue-800 text-base border border-blue-200">
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

      {/* Footer buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Button
          onClick={() => navigate("/quizzes")}
          variant="outline"
          className="flex items-center gap-2 rounded-full px-6 py-3 shadow-sm hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        <Button
          onClick={() => navigate(`/quiz/${quiz.id}`)}
          className="flex items-center gap-2 rounded-full px-6 py-3 bg-primary text-white shadow-md hover:bg-primary/90 transition-colors border border-primary"
        >
          <CheckCircle2 className="h-4 w-4" />
          Recommencer
        </Button>
        <Button
          onClick={() => navigate(`/classement`)}
          variant="outline"
          className="flex items-center gap-2 rounded-full px-6 py-3 shadow-sm hover:bg-muted transition-colors"
        >
          <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mr-1" />
          Classement
        </Button>
      </div>
    </div>
  );
}
