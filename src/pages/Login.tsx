import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import { messaging, getToken } from "@/firebase-fcm";
import { api } from "@/services";

const Login = () => {
  const { user, login, isLoading } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("1. Début de la connexion");
      await login(email, password);
      console.log("2. Connexion réussie");

      // 🔍 Vérifier si le token est bien présent après login
      const tokenAfterLogin = localStorage.getItem("token");
      console.log(
        "3. Token après login:",
        tokenAfterLogin ? "PRÉSENT" : "ABSENT"
      );

      try {
        console.log("4. Demande de permission notifications");
        const permission = await Notification.requestPermission();
        console.log("5. Permission:", permission);

        if (permission === "granted") {
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          console.log("6. VAPID Key:", vapidKey ? "PRÉSENTE" : "MANQUANTE");

          console.log("7. Récupération du token FCM");
          const currentToken = await getToken(messaging, { vapidKey });
          console.log("8. Token FCM:", currentToken ? "OBTENU" : "NON OBTENU");

          if (currentToken) {
            console.log("9. Envoi du token FCM au backend");
            await api.post("/fcm-token", { token: currentToken });
            console.log("10. Token FCM envoyé avec succès");
          }
        }
      } catch (fcmError) {
        console.error("❌ Erreur FCM (non bloquante):", fcmError);
        // Ne pas bloquer l'utilisateur pour une erreur FCM
      }
    } catch (err) {
      console.error("❌ Erreur de connexion principale:", err);
      setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  // Redirect if already logged in
  if (user || localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        background: `linear-gradient(to top, white 0%, var(--brand-primary) 0%, rgba(255,255,255,0) 100%)`,
      }}>
      {/* Logo en haut */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Wizi Learn" className="h-32 mb-2 drop-shadow-lg" />
        <p className="text-black font-bold text-center max-w-xs">
          La plateforme de quiz éducatifs 
        </p>
      </div>
      <div className="w-full max-w-md px-4">
        <Card
          className="shadow-xl bg-white/90 backdrop-blur-md"
          style={{ border: '2px solid rgba(254,184,35,0.18)' }}>
          <CardHeader className="space-y-1">
            <CardDescription
              className="text-center font-semibold text-lg"
              style={{ color: 'var(--brand-primary)' }}>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@wizi-learn.com"
                  required
                  autoComplete="email"
                  className="focus:outline-none"
                  style={{ borderColor: 'transparent' }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium" style={{ color: 'var(--brand-secondary)' }}>
                    Mot de passe
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-langues hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white font-semibold shadow-md transition hover:bg-[color:var(--brand-primary-dark)]"
                disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
