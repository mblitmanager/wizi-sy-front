
import React from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-center mb-6">Inscription</h2>
      <p className="text-center text-gray-600 mb-6 font-roboto">
        Créez votre compte pour accéder à notre plateforme d'apprentissage
      </p>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
