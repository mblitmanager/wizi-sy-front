import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const logo = "/logons.png";
import logonsImg from "@/assets/ns.png";
import wiziLogo from "@/assets/logo.png";

interface ApiResponse {
  message?: string;
  error?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        email,
        reset_url: window.location.origin, // Envoie l'URL du frontend
      });
      setMessage("Un email avec le lien de réinitialisation a été envoyé");
      setError("");
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      setError(error.response?.data?.error || "Une erreur est survenue");
      setMessage("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        background: `linear-gradient(to top, white 0%, var(--brand-primary) 0%, rgba(255,255,255,0) 100%)`,
      }}>
      {/* Logo en haut */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-6">
          <img
            src={logonsImg}
            alt="NS Conseil"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 opacity-90"
          />
          <img
            src={wiziLogo}
            alt="Wizi Learn"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28"
          />
        </div>
        <p className="text-black font-bold text-center max-w-xs">
          La plateforme de quiz éducatifs pour nos stagiaires
        </p>
      </div>
      <div className="w-full max-w-md px-4">
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
              className="w-full bg-black text-white font-semibold shadow-md transition hover:bg-[color:var(--brand-primary-dark)]">
              Envoyer le lien de réinitialisation
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
    </div>
  );
};

export default ForgotPassword;
