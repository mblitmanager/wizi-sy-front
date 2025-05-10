import { Question } from "@/types/quiz";

// Fonction utilitaire pour normaliser les chaînes (accents, casse, espaces)
export function normalizeString(str: string): string {
  return str
    .normalize("NFD") // décompose les accents
    .replace(/\u0300-\u036f/g, "") // supprime les diacritiques
    .toLowerCase()
    .trim();
}

// Fonction pour formater les réponses de l'utilisateur
export function formatAnswer(
  question: Question,
  userAnswer:
    | string
    | number
    | Record<string, string | number>
    | Array<string | number>
    | null
    | undefined
): string {
  if (!userAnswer) return "Aucune réponse";

  switch (question.type) {
    case "remplir le champ vide": {
      if (typeof userAnswer === "object" && !Array.isArray(userAnswer)) {
        return (
          Object.values(userAnswer)
            .map((val) => {
              const found = question.answers?.find(
                (a) => normalizeString(a.text) === normalizeString(String(val))
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
              (a) => a.id === String(rightValue)
            );
            pairs.push(
              `${leftItem?.text || leftId} → ${rightItem?.text || rightValue}`
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
              const rightItem = question.answers?.find((a) => a.id === rightId);
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
      const answer = question.answers?.find((a) => a.id === String(userAnswer));
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
      const answer = question.answers?.find((a) => a.id === String(userAnswer));
      return answer ? answer.text : String(userAnswer);
    }
  }
}

// Fonction pour formater la bonne réponse
export function formatCorrectAnswer(question: Question): string {
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
}

export function isAnswerCorrect(
  question: Question,
  userAnswer:
    | string
    | number
    | Record<string, string | number>
    | Array<string | number>
    | null
    | undefined
): boolean {
  // On ne fait confiance à isCorrect que si c'est explicitement true
  if (question.isCorrect === true) {
    return true;
  }
  // Sinon, on vérifie normalement
  const userAnswerData = userAnswer;
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
            normalizeString(String(userValues[idx])) === normalizeString(a.text)
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
}
