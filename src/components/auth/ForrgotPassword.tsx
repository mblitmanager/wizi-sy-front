import { useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicAuthShell } from "@/components/auth/PublicAuthShell";

interface ApiResponse {
  message?: string;
  error?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/forgot-password", {
        email,
        reset_url: window.location.origin, // Envoie l'URL du frontend
      });
      setMessage("Un email avec le lien de réinitialisation a été envoyé");
      setError("");
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      setError(error.response?.data?.error || error.response?.data?.message || "Une erreur est survenue");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicAuthShell eyebrow="ASSISTANCE APPRENANT" title="Reprenez votre parcours en toute sérénité.">
      <div className="mx-auto w-full max-w-md">
        <div
          className="shadow-xl bg-white/90 backdrop-blur-md rounded-lg p-6"
          style={{ border: "2px solid rgba(254,184,35,0.18)" }}>
          <div className="space-y-1 mb-6">
            <h2
              className="text-center font-semibold text-lg"
              style={{ color: "var(--brand-primary)" }}>
              Réinitialisation du mot de passe
            </h2>
            <p className="text-center text-sm text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-brand-secondary">
                Adresse Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@wizi-learn.com"
                required
                autoComplete="email"
                className="focus:outline-none"
                style={{ borderColor: "transparent" }}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white font-semibold shadow-md transition hover:bg-[color:var(--brand-primary-dark)]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link
              to="/login"
              className="hover:underline font-medium text-brand-secondary">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </PublicAuthShell>
  );
};

export default ForgotPassword;
