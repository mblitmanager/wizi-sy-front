
import React from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-montserrat font-bold text-center mb-6">Inscription</h2>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
