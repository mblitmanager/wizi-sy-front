
import { api } from "@/services/api";
import { QuizResult } from "@/types/quiz";

export const quizAnswerService = {
  submitQuizAnswers: async (
    quizId: string,
    answers: Record<string, any>
  ): Promise<QuizResult> => {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    
    // Process the response to calculate points based on correct answers
    const processedResult = processQuizResult(response.data);
    return processedResult;
  },
};

// Process the quiz result to calculate points based on 2 points per correct answer
function processQuizResult(result: any): QuizResult {
  const questions = result.questions || [];
  const correctAnswers = questions.filter((q: any) => q.isCorrect).length;
  
  // Calculate total questions
  const totalQuestions = questions.length;
  
  // Calculate score - 2 points per correct answer
  const score = correctAnswers * 2;
  
  // Calculate total possible points
  const totalPoints = totalQuestions * 2;
  
  // Format the answers in the questions to ensure they have proper format
  const formattedQuestions = questions.map((question: any) => {
    const formattedQuestion = { ...question };
    
    // Ensure answers are properly formatted
    if (question.answers && Array.isArray(question.answers)) {
      formattedQuestion.answers = question.answers.map((answer: unknown) => {
        // If answer is just a string, convert to proper format
        if (typeof answer === 'string') {
          return {
            id: answer,
            text: answer
          };
        }
        // If it's already an object with text property
        else if (typeof answer === 'object' && answer !== null && 'text' in answer) {
          return answer;
        }
        // Default case
        return {
          id: String(Math.random()),
          text: String(answer)
        };
      });
    }
    
    return formattedQuestion;
  });
  
  return {
    ...result,
    score,
    totalPoints,
    correctAnswers,
    totalQuestions,
    questions: formattedQuestions
  };
}
