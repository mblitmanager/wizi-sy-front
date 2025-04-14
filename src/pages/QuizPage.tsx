import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { quizService } from '../services/quizService';
import { Question, QuestionAnswer } from '../types/quiz';
import { Timer } from '@/components/ui/timer';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import { quizAPI } from '../api';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) return;
      setIsLoading(true);
      try {
        console.log('Récupération des questions pour le quiz:', quizId);
        // Utiliser quizAPI pour récupérer les questions spécifiques au quiz
        const quizQuestions = await quizAPI.getQuizQuestions(quizId);
        console.log('Questions brutes reçues:', quizQuestions);
        
        if (!quizQuestions || quizQuestions.length === 0) {
          console.error('Aucune question reçue de l\'API');
          toast.error('Aucune question disponible pour ce quiz');
          return;
        }
        
        // Formater les questions pour correspondre à la structure attendue
        const formattedQuestions = quizQuestions.map(q => {
          console.log('Traitement de la question:', q);
          return {
            id: q.id,
            quiz_id: q.quiz_id || quizId,
            text: q.text || q.question || 'Question sans texte',
            type: q.type || 'choix multiples',
            media_url: q.media_url,
            explication: q.explication,
            points: q.points || 1,
            astuce: q.astuce,
            options: q.options || [],
            correct_answer: q.correct_answer || '',
            time_limit: q.time_limit
          };
        });
        
        console.log('Questions formatées:', formattedQuestions);
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load quiz questions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const handleAnswer = (questionId: string, answer: QuestionAnswer) => {
    console.log('Réponse sélectionnée:', { questionId, answer });
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizId) return;
    setIsSubmitting(true);
    try {
      // Convertir les réponses au format attendu par l'API
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
        if (Array.isArray(answer)) {
          return answer.join(',');
        } else if (typeof answer === 'object') {
          return JSON.stringify(answer);
        }
        return answer.toString();
      });

      console.log('Réponses formatées pour soumission:', formattedAnswers);
      const result = await quizService.submitQuiz(quizId, formattedAnswers);
      navigate(`/quiz/${quizId}/result`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log('Question courante:', currentQuestion);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Timer timeLeft={timeLeft} onTimeUp={handleSubmit} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1} sur {questions.length}</h2>
          <p className="text-gray-600">Type: {currentQuestion.type}</p>
        </div>
        
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          isAnswerChecked={false}
          selectedAnswer={answers[currentQuestion.id]}
          timeRemaining={timeLeft}
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
