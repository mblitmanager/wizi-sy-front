
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Quizzy</h3>
            <p className="text-gray-600">
              Plateforme de quiz interactive et ludique pour les stagiaires d'AOPIA.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="text-gray-600 hover:text-primary">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/classement" className="text-gray-600 hover:text-primary">
                  Classement
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="text-gray-600 hover:text-primary">
                  Agenda
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/conditions" className="text-gray-600 hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-600 hover:text-primary">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} AOPIA - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
