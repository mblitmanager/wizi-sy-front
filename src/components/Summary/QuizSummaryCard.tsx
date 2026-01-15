import { Trophy } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface QuizSummaryCardProps {
  score: number;
  totalQuestions: number;
}

export default function QuizSummaryCard({
  score,
  totalQuestions,
}: QuizSummaryCardProps) {
  const isSuccess = score >= totalQuestions / 2;
  
  // Animation du score
  const springConfig = { stiffness: 50, damping: 20 };
  const count = useSpring(0, springConfig);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    count.set(score);
  }, [score, count]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Trophy
          className={`h-12 w-12 mb-2 ${isSuccess ? "text-yellow-500" : "text-gray-400"}`}
        />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        {isSuccess ? "Félicitations !" : "Pas mal !"}
      </h3>
      
      <div className="mt-2 flex items-baseline gap-1">
        <motion.span className="text-4xl font-extrabold text-orange-600 dark:text-orange-500">
          {rounded}
        </motion.span>
        <span className="text-xl font-medium text-slate-500 dark:text-gray-400">
          / {totalQuestions}
        </span>
      </div>
      
      <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">
        points récoltés
      </p>
    </div>
  );
}
