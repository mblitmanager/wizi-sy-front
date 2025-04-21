import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Register = () => {
  const { user } = useUser();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Accès Restreint
            </CardTitle>
            <CardDescription className="text-center">
              L'accès à la plateforme est uniquement disponible via des identifiants fournis par l'administrateur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Si vous n'avez pas encore reçu vos identifiants, veuillez contacter l'administrateur de votre organisation.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">
                Se connecter
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
