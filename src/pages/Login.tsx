import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("demo@aopia.fr");
  const [password, setPassword] = useState("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white via-blue-50 to-gray-100">
      {/* Logo en haut */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/lovable-uploads/e4aa6740-d9f0-40d2-a150-efc75ae46692.png"
          alt="Wizi Learn"
          className="h-16 mb-2 drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold text-bureautique mb-1 font-astria">Wizi Learn</h1>
        <p className="text-gray-500 text-center max-w-xs">La plateforme de quiz éducatifs d'AOPIA pour les stagiaires</p>
      </div>
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl border-2 border-bureautique/30 bg-white/90 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-bureautique">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@aopia.fr"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
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
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-bureautique hover:bg-bureautique/90 text-white font-semibold shadow-md transition"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              <p className="text-center text-sm">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-bureautique hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
