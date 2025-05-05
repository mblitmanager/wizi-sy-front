import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFoundImage from "../assets/Img404.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8 text-center">
      {/* Illustration */}
      <img
        src={NotFoundImage}
        alt="Page not found"
        className="w-80 h-auto mb-8"
      />

      {/* Text Content */}
      <p className="text-xl text-gray-600 mb-2">Oups ! Page introuvable</p>
      <p className="text-md text-gray-500 mb-6">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      {/* Return button */}
      <a
        href="/"
        className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition duration-200">
        Retour à l'accueil
      </a>
    </div>
  );
};

export default NotFound;
