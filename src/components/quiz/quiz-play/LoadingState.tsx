
import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">{message}</p>
    </div>
  );
}
