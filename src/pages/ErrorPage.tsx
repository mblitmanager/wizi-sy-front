
import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, RefreshCw } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  const errorMessage = error?.statusText || error?.message || "Une erreur s'est produite";
  const isNotFound = error?.status === 404;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500 font-montserrat">
          {isNotFound ? '404' : 'Oups!'}
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 font-montserrat">
          {isNotFound ? 'Page introuvable' : 'Quelque chose s\'est mal passé'}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md font-roboto">
          {isNotFound 
            ? "La page que vous recherchez n'existe pas ou a été déplacée."
            : errorMessage
          }
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto font-nunito">
              <HomeIcon className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto font-nunito" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir la page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
