import { Question } from "@/types/quiz";

// Fonction utilitaire pour normaliser les chaînes (accents, casse, espaces)
export function normalizeString(str: string): string {
  return str
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
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
      // Formatage de la réponse utilisateur
      let formattedAnswer = "";
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
        formattedAnswer = pairs.join("; ") || "Aucune réponse";
      } else if (Array.isArray(userAnswer)) {
        formattedAnswer = userAnswer
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
      } else {
        formattedAnswer = String(userAnswer);
      }

      // Vérification de la correction
      const isCorrect = (() => {
        if (!question.meta?.correctAnswers) return false;
        if (typeof userAnswer !== "object" || Array.isArray(userAnswer))
          return false;

        const correctAnswers = question.meta.correctAnswers;

        // 1. Vérifier que toutes les réponses correctes sont présentes et correctes
        for (const [country, capital] of Object.entries(correctAnswers)) {
          if (userAnswer[country] !== capital) {
            return false;
          }
        }

        // 2. Vérifier qu'il n'y a pas de réponses supplémentaires
        const userCountries = Object.keys(userAnswer).filter(
          (k) => k !== "destination"
        );
        const correctCountries = Object.keys(correctAnswers);

        if (userCountries.length !== correctCountries.length) {
          return false;
        }

        return true;
      })();

      // Mise à jour de la propriété isCorrect dans la question
      question.isCorrect = isCorrect;
      if (question.meta) {
        question.meta.isCorrect = isCorrect;
      }

      // Retourne simplement la chaîne formatée au lieu d'un objet
      return formattedAnswer;
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
      // Robust handling of object or array formats
      let actualValue = userAnswer;
      if (typeof userAnswer === "object" && userAnswer !== null) {
        if (Array.isArray(userAnswer)) {
          actualValue = userAnswer[0];
        } else if ("text" in (userAnswer as any)) {
          actualValue = (userAnswer as any).text;
        } else if ("id" in (userAnswer as any)) {
          actualValue = (userAnswer as any).id;
        }
      }

      const answer = question.answers?.find(
        (a) =>
          a.id === String(actualValue) ||
          normalizeString(a.text) === normalizeString(String(actualValue))
      );
      return answer ? answer.text : String(actualValue);
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
      if (typeof userAnswer === "object" && "text" in userAnswer) {
        return String(userAnswer.text);
      }
      if (typeof userAnswer === "string") {
        return userAnswer;
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
      if (question.meta?.match_pair) {
        const pairs = question.meta.match_pair.map((pair) => {
          return `${pair.left} → ${pair.right}`;
        });
        return pairs.length > 0
          ? pairs.join("; ")
          : "Aucune réponse correcte définie";
      } else {
        // Fallback si meta.match_pair n'existe pas
        const leftItems = question.answers?.filter(
          (a) => a.isCorrect || a.is_correct === 1
        );
        const pairCount = leftItems?.length ?? 0;
        const half = Math.floor(pairCount / 2);
        const left = leftItems?.slice(0, half) ?? [];
        const right = leftItems?.slice(half) ?? [];

        const pairs = left.map((leftItem, index) => {
          const rightItem = right[index];
          return `${leftItem.text} → ${rightItem?.text ?? "?"}`;
        });

        return pairs.length > 0
          ? pairs.join("; ")
          : "Aucune réponse correcte définie";
      }
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
  const userAnswerData = userAnswer;
  if (!userAnswerData) return false;

  switch (question.type) {
    case "remplir le champ vide": {
      const correctBlanks: Record<string, string> = {};
      question.answers?.forEach((a) => {
        if (a.bank_group && (a.isCorrect || a.is_correct === 1)) {
          correctBlanks[a.bank_group] = a.text;
        }
      });

      if (Object.keys(correctBlanks).length > 0) {
        // Cas avec bank_group
        if (typeof userAnswerData !== "object" || Array.isArray(userAnswerData))
          return false;

        return Object.entries(userAnswerData).every(([key, value]) => {
          const correctAnswer = correctBlanks[key];
          if (!correctAnswer) return false;
          return (
            normalizeString(String(value)) === normalizeString(correctAnswer)
          );
        });
      } else {
        // Cas sans bank_group : on compare simplement les textes
        const correctAnswers = question.answers
          ?.filter((a) => a.isCorrect || a.is_correct === 1)
          .map((a) => normalizeString(a.text));

        const userAnswers = Array.isArray(userAnswerData)
          ? userAnswerData.map((ans) => normalizeString(String(ans)))
          : [normalizeString(String(userAnswerData))];

        return (
          correctAnswers?.length === userAnswers.length &&
          correctAnswers.every((ca) => userAnswers.includes(ca))
        );
      }
    }

    case "correspondance": {
      // Initialisation de answersById en premier
      const answersById = Object.fromEntries(
        (question.answers || []).map((a) => [String(a.id), a])
      );

      // Vérification basée sur meta.correctAnswers si disponible
      if (
        question.meta?.correctAnswers &&
        typeof userAnswerData === "object" &&
        !Array.isArray(userAnswerData)
      ) {
        const correctAnswers = question.meta.correctAnswers;
        const userAnswers = userAnswerData;

        // 1. Vérifier que toutes les réponses correctes sont présentes et correctes
        const allCorrect = Object.entries(correctAnswers).every(
          ([country, capital]) => {
            const countryItem = question.answers?.find(
              (a) => a.text === country
            );
            if (!countryItem) return false;

            const userCapital = userAnswers[countryItem.text];
            if (!userCapital) return false;

            const capitalItem = question.answers?.find(
              (a) => a.text === capital
            );
            if (!capitalItem) return false;

            return (
              String(userCapital) === String(capitalItem.id) ||
              normalizeString(String(userCapital)) ===
                normalizeString(String(capital))
            );
          }
        );

        // 2. Vérifier qu'il n'y a pas de réponses supplémentaires
        const userCountries = Object.keys(userAnswers).filter(
          (country) => correctAnswers[country]
        );

        const correctCountries = Object.keys(correctAnswers);

        const noExtraAnswers =
          userCountries.length === correctCountries.length &&
          userCountries.every((country) => correctCountries.includes(country));

        return allCorrect && noExtraAnswers;
      }

      // Fallback à l'ancienne méthode si meta.correctAnswers n'est pas disponible
      if (typeof userAnswerData !== "object") return false;

      if (Array.isArray(userAnswerData)) {
        return userAnswerData.every((pairStr) => {
          if (typeof pairStr !== "string" || !pairStr.includes("-"))
            return false;

          const [leftId, rightId] = pairStr.split("-");
          const leftItem = answersById[leftId];
          const rightItem = answersById[rightId];

          if (!leftItem || !rightItem) return false;

          return (
            leftItem.match_pair === rightItem.id ||
            leftItem.match_pair === rightItem.text
          );
        });
      } else {
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
      if (!Array.isArray(userAnswerData)) return false;

      return userAnswerData.every(
        (text, idx) => text === question.correctAnswers?.[idx]
      );
    }

    case "question audio": {
      if (typeof userAnswerData === "string") {
        // Trouve la réponse correspondante et vérifie si elle est correcte
        const answer = question.answers?.find((a) => a.text === userAnswerData);
        return answer ? answer.isCorrect : false;
      }

      if (typeof userAnswerData === "object" && "text" in userAnswerData) {
        // Trouve par texte ou ID et vérifie si correct
        const answer = question.answers?.find(
          (a) =>
            a.text === userAnswerData.text || a.id === String(userAnswerData.id)
        );
        return answer ? answer.isCorrect : false;
      }

      return false;
    }

    case "banque de mots": {
      if (!Array.isArray(userAnswerData)) return false;

      // 1. Obtenir les textes des réponses correctes (normalisés)
      const correctAnswerTexts = question.answers
        ?.filter((a) => a.isCorrect || a.is_correct === 1)
        .map((a) => a.text.toLowerCase().trim());

      if (!correctAnswerTexts?.length) return false;

      // 2. Normaliser les réponses utilisateur
      const userAnswersNormalized = userAnswerData.map((answer) =>
        String(answer).toLowerCase().trim()
      );

      // 3. Vérifier que toutes les réponses correctes sont présentes
      // et qu'il n'y a pas de réponses incorrectes
      return (
        correctAnswerTexts.every((correctText) =>
          userAnswersNormalized.includes(correctText)
        ) &&
        userAnswersNormalized.every((userText) =>
          correctAnswerTexts.includes(userText)
        )
      );
    }

    case "choix multiples": {
      // Vérification que la réponse est un tableau
      if (!Array.isArray(userAnswerData)) return false;
      // Cas où il n'y a pas de bonnes réponses définies
      if (!question.correctAnswers || question.correctAnswers.length === 0) {
        return false;
      }

      // Vérification que toutes les réponses correctes sont sélectionnées
      // et qu'aucune réponse incorrecte n'est sélectionnée
      const allCorrectSelected = question.correctAnswers.every((answer) =>
        userAnswerData.includes(String(answer))
      );

      const noIncorrectSelected = userAnswerData.every((answer) =>
        question.correctAnswers.includes(String(answer))
      );

      return allCorrectSelected && noIncorrectSelected;
    }

    case "vrai/faux": {
      // Robust logic for Vrai/Faux which might come as single value, array or object
      let actualUserAnswer = userAnswerData;
      if (typeof userAnswerData === "object" && userAnswerData !== null) {
        if (Array.isArray(userAnswerData)) {
          actualUserAnswer = userAnswerData[0];
        } else if ("id" in (userAnswerData as any)) {
          actualUserAnswer = (userAnswerData as any).id;
        } else if ("text" in (userAnswerData as any)) {
          // If we only have text, find the ID
          const found = question.answers?.find(
            (a) =>
              normalizeString(a.text) ===
              normalizeString((userAnswerData as any).text)
          );
          actualUserAnswer = found ? found.id : (userAnswerData as any).text;
        }
      }

      const normalizedUser = normalizeString(String(actualUserAnswer));

      // Check against correctAnswers if available
      if (question.correctAnswers && question.correctAnswers.length > 0) {
        return question.correctAnswers.some(
          (ca) => normalizeString(String(ca)) === normalizedUser
        );
      }

      // Fallback to searching answers array
      const correctAnswer = question.answers?.find(
        (a) => a.isCorrect || a.is_correct === 1
      );
      if (correctAnswer) {
        return (
          normalizeString(String(correctAnswer.id)) === normalizedUser ||
          normalizeString(correctAnswer.text) === normalizedUser
        );
      }

      return false;
    }

    case "carte flash": {
      // Pour les flashcards
      const correctAnswer = question.answers?.find(
        (a) => a.isCorrect || a.is_correct === 1
      );

      if (!correctAnswer) return false;

      // Extraire la réponse si elle est dans un objet selectedAnswers
      let userAnswer = userAnswerData;
      if (
        userAnswerData &&
        typeof userAnswerData === "object" &&
        "selectedAnswers" in userAnswerData
      ) {
        userAnswer = userAnswerData.selectedAnswers;
      }
      if (Array.isArray(userAnswer)) {
        userAnswer = userAnswer[0];
      }

      // Si la réponse est directement dans correctAnswers
      if (question.correctAnswers && question.correctAnswers.length > 0) {
        const normalizedUserAnswer = normalizeString(String(userAnswer));
        const normalizedCorrectAnswers = question.correctAnswers.map((ca) =>
          normalizeString(String(ca))
        );

        return normalizedCorrectAnswers.includes(normalizedUserAnswer);
      }

      // Vérification par texte ou ID
      return (
        normalizeString(correctAnswer.text) ===
          normalizeString(String(userAnswer)) ||
        String(correctAnswer.id) === String(userAnswer)
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
