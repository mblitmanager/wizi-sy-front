import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  description?: string;
}

export function ErrorState({
  title = "Erreur lors du chargement du quiz",
  description = "Nous n'avons pas pu charger ce quiz. Il est possible que le quiz n'existe pas ou que vous n'ayez pas accès à celui-ci.",
}: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      <div className="mt-4 flex justify-center">
        <Button onClick={() => navigate("/quizzes")} variant="outline">
          Retourner à la liste des quiz
        </Button>
      </div>
    </div>
  );
}
