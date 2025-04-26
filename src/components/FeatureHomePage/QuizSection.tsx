// components/QuizSection.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";

interface QuizLevel {
  id: number | string;
  name: string;
  questions: number;
  icon: React.ReactNode;
}

interface QuizSectionProps {
  quizLevels: QuizLevel[];
}

export default function QuizSection({ quizLevels }: QuizSectionProps) {
  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          Quiz disponibles
        </h2>
        <Link to="/quiz">
          <Button className="text-blue-400" variant="ghost" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {quizLevels.map((level) => (
          <Card key={level.id} className="text-center">
            <CardHeader className="p-4">
              <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {level.icon}
              </div>
              <CardTitle className="text-lg">{level.name}</CardTitle>
              <CardDescription>{level.questions} questions</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Commencer</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
