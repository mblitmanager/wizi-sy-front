import { Loader2 } from "lucide-react";

export default function LoadingCustom() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Chargement en cours...
      </div>
    </div>
  );
}
