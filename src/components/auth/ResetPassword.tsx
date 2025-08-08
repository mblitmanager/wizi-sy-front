import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

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
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError("Token ou email manquant");
      return;
    }

    try {
      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/reset-password`,
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
                className="text-sm font-medium text-[#A55E6E]"
              >
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
                className="text-sm font-medium text-[#A55E6E]"
              >
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
                className="focus:border-[#A55E6E]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="passwordConfirmation"
                className="text-sm font-medium text-[#A55E6E]"
              >
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
                className="focus:border-[#A55E6E]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-[#8B5C2A] text-white font-semibold shadow-md transition"
            >
              Réinitialiser le mot de passe
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

export default ResetPassword;
