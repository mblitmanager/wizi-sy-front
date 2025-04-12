import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="font-roboto"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link to="/auth/reset-password" className="text-sm text-blue-600 hover:underline font-nunito">
            Mot de passe oublié?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="font-roboto"
          autoComplete="current-password"
        />
      </div>

      {error && <div className="text-red-500 text-sm font-roboto">{error}</div>}

      <Button type="submit" className="w-full font-nunito" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Connexion...
          </span>
        ) : (
          'Se connecter'
        )}
      </Button>

      <div className="text-center text-sm font-roboto">
        <span className="text-gray-600">Pas encore de compte? </span>
        <Link to="/auth/register" className="text-blue-600 hover:underline font-nunito">
          S'inscrire
        </Link>
      </div>

      {/* Demo login for testing */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <Button
          variant="outline"
          className="w-full font-nunito"
          onClick={() => {
            setEmail('demo@example.com');
            setPassword('password');
          }}
          type="button"
        >
          Remplir avec un compte démo
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
