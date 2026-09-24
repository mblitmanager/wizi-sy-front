import { Loader2 } from "lucide-react";
import quizimg from "../../../assets/loading_img.png";

export function LoadingState({
  message = "Chargement...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" role="status" aria-live="polite">
      <div className="flex items-center justify-center flex-col gap-4">
        <img
          src={quizimg}
          alt="Chargement"
          className="h-40 w-40 md:h-56 md:w-56 animate-bounce-slow"
        />
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
}
