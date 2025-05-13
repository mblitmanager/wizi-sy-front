import { Loader2 } from "lucide-react";
import quizimg from "../../../assets/loading_img.png";

export function LoadingState({
  message = "Chargement...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex items-center justify-center flex-col gap-4">
        <img
          src={quizimg}
          alt="Chargement"
          className="h-72 w-72 animate-bounce-slow"
        />
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
}
