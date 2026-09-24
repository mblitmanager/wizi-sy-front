import { useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicAuthShell } from "@/components/auth/PublicAuthShell";

interface ApiResponse {
  message?: string;
  error?: string;
}

interface ResetPasswordData {
  token: string | null;
  email: string | null;
  password: string;
  password_confirmation: string;
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError("Token ou email manquant");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<ApiResponse>(
        "/reset-password",
        {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        } as ResetPasswordData
      );

      setMessage(response.data.message || "");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      setError(error.response?.data?.error || error.response?.data?.message || "Une erreur est survenue");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicAuthShell eyebrow="SÉCURITÉ DU COMPTE" title="Un accès sécurisé pour continuer à apprendre.">
      <div className="mx-auto w-full max-w-md">
        <div
          className="shadow-xl bg-white/90 backdrop-blur-md rounded-lg p-6"
          style={{ border: "2px solid rgba(254,184,35,0.18)" }}>
          <div className="space-y-1 mb-6">
            <h2
              className="text-center font-semibold text-lg"
              style={{ color: "var(--brand-primary)" }}>
              Créer un nouveau mot de passe
            </h2>
            <p className="text-center text-sm text-gray-600">
              Entrez et confirmez votre nouveau mot de passe
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
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-langues">
                Nouveau mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="new-password"
                className="focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="passwordConfirmation"
                className="text-sm font-medium text-langues">
                Confirmer le mot de passe
              </label>
              <Input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="new-password"
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
                  Réinitialisation...
                </>
              ) : (
                "Réinitialiser le mot de passe"
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

export default ResetPassword;
