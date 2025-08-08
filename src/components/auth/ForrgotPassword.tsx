import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-t from-[#FEB823] via-[#FFF8E1] to-white">
      {/* Logo en haut */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Wizi Learn" className="h-32 mb-2 drop-shadow-lg" />
        <p className="text-[#000] font-bold text-center max-w-xs">
          La plateforme de quiz éducatifs pour nos stagiaires
        </p>
      </div>
      <div className="w-full max-w-md px-4">
        <div className="shadow-xl border-2 border-[#FEB823]/30 bg-white/90 backdrop-blur-md rounded-lg p-6">
          <div className="space-y-1 mb-6">
            <h2 className="text-center text-[#FEB823] font-semibold text-lg">
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
                className="text-sm font-medium text-[#A55E6E]"
              >
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
                className="focus:border-[#3D9BE9]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-[#8B5C2A] text-white font-semibold shadow-md transition"
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link
              to="/login"
              className="text-[#A55E6E] hover:underline font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
