
import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-center mb-6">Connexion</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
