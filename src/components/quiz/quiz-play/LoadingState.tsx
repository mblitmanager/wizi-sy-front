import { Loader2 } from "lucide-react";
import quizimg from "../../../assets/loading_img.png";

export function LoadingState({
  message = "Chargement...",
}: {
  message?: string;
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-center flex-col gap-4">
        <img src={quizimg} alt="Chargement" className="h-40 w-40" />
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
    </div>
  );
}
