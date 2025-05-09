
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Trophy, Award, Star } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface QuizResultsDialogProps {
  open: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    points: number;
  }[];
  questions: {
    id: string;
    text: string;
    explication?: string;
  }[];
  onRestart: () => void;
}

export function QuizResultsDialog({
  open,
  onClose,
  score,
  totalQuestions,
  answers,
  questions,
  onRestart
}: QuizResultsDialogProps) {
  const navigate = useNavigate();

  // Calculate percentage score
  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  // Get correct answers count
  const correctAnswersCount = answers.filter((a) => a.isCorrect).length;
  
  // Calculate stars based on score percentage
  const stars = scorePercentage >= 80 ? 3 : scorePercentage >= 60 ? 2 : scorePercentage >= 40 ? 1 : 0;

  // Trigger confetti when dialog opens and score is good
  useEffect(() => {
    if (open && scorePercentage >= 70) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        confetti({
          particleCount: 2,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: randomInRange(0.1, 0.5)
          }
        });
      }, 250);
    }
  }, [open, scorePercentage]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-slate-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">Résultats du Quiz</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="mb-4"
          >
            <div className="relative inline-block">
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600">
                {scorePercentage}%
              </div>
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <Trophy className="absolute -top-6 -right-6 h-8 w-8 text-yellow-500" />
              </motion.div>
            </div>
            <p className="text-2xl mb-1 font-medium">{score} points</p>
            <p className="text-gray-600">
              {correctAnswersCount} bonnes réponses sur {totalQuestions}
            </p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center gap-2 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: i < stars ? 1 : 0.7, 
                  opacity: 1,
                }}
                transition={{ delay: 1 + i * 0.2, type: "spring" }}
              >
                <Star 
                  className={`h-8 w-8 ${i < stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              </motion.div>
            ))}
          </motion.div>
          
          {scorePercentage >= 80 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-green-600 font-medium mt-2"
            >
              Excellent travail ! 🎉
            </motion.div>
          )}
          
          {scorePercentage >= 60 && scorePercentage < 80 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-blue-600 font-medium mt-2"
            >
              Bon travail ! 👍
            </motion.div>
          )}
          
          {scorePercentage < 60 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-amber-600 font-medium mt-2"
            >
              Continue à t'entraîner ! 💪
            </motion.div>
          )}
        </div>
        
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          {answers.map((answer, index) => {
            const question = questions.find((q) => q.id === answer.questionId);
            return (
              <motion.div 
                key={answer.questionId} 
                className="space-y-2 border-b pb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h3 className="font-medium">{question?.text}</h3>
                <div className={`flex items-center gap-2 p-2 rounded-md ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  {answer.isCorrect ? (
                    <CheckCircle2 className="text-green-500 h-5 w-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{answer.points} points</span>
                </div>
                {!answer.isCorrect && question?.explication && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md mt-1 border-l-4 border-blue-400">
                    <strong>Explication:</strong> {question.explication}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <DialogFooter className="gap-2 pt-4 mt-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" onClick={() => navigate('/quizzes')}>
              Retour aux quiz
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={onRestart} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Recommencer
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
