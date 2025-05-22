import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function LienParrainage() {
  const [parrainageLink, setParrainageLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateLink = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/parrainage/generate-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setParrainageLink(data.link);
      } else {
        throw new Error(data.message || "Erreur lors de la génération du lien");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const input = document.createElement("input");
    input.value = parrainageLink;
    document.body.appendChild(input);
    input.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(input);

      if (successful) {
        toast({ title: "Copié !", description: "Lien copié" });
      } else {
        throw new Error("Échec de la copie");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Échec de la copie",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={generateLink}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        {isLoading ? "Génération..." : "Générer mon lien de parrainage"}
      </Button>

      {parrainageLink && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={parrainageLink}
            readOnly
            aria-label="Lien de parrainage"
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            aria-label="Copier le lien"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
