
import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-center mb-6">Connexion</h2>
      <p className="text-center text-gray-600 mb-6 font-roboto">
        Entrez vos identifiants pour accéder à votre espace stagiaire
      </p>
      <LoginForm />
      <div className="mt-6 text-center text-sm text-gray-500 font-roboto">
        <p>Pour les tests, vous pouvez utiliser :</p>
        <p>Email: demo@example.com</p>
        <p>Mot de passe: password</p>
      </div>
    </div>
  );
};

export default LoginPage;
