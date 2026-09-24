import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/utils/roles";
import { PublicAuthShell } from "@/components/auth/PublicAuthShell";

const Login = () => {
  const { user, token, role, login } = useUser();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const newToken = await login(email, password);
    if (!newToken) {
      setError("Veuillez vérifier votre connexion ou votre mail/mot de passe.");
      setIsSubmitting(false);
    }
  };
  if (token && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    return <Navigate to={from || ROLE_HOME[role]} replace />;
  }

  return (
    <PublicAuthShell>
        <div className="mx-auto w-full max-w-md">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 px-0">
              <p className="text-center text-xs font-bold tracking-[0.2em] text-[#d18a00]">BON RETOUR</p>
              <h2 className="text-center font-poppins text-3xl font-semibold text-[#263548]">Se connecter</h2>
              <CardDescription className="pt-2 text-center text-sm leading-6 text-slate-500">
                Entrez vos identifiants pour retrouver votre parcours de formation.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-6">
              {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#263548]">Email</label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemple@wizi-learn.com" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold text-[#263548]">Mot de passe</label>
                    <Link to="/forgot-password" className="text-sm font-medium text-[#b47700] hover:underline">Mot de passe oublié ?</Link>
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="h-12 w-full bg-[#263548] text-white font-semibold shadow-lg shadow-[#263548]/20 transition hover:bg-[#245963]" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connexion en cours...</> : "Se connecter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
    </PublicAuthShell>
  );
};

export default Login;
