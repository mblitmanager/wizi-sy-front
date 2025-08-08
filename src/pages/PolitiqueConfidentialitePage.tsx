import { Layout } from "@/components/layout/Layout";
import logo from "../../assets/logo.png";

const PolitiqueConfidentialitePage = () => (
  <Layout>
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex flex-col items-center mb-6">
        <img src="/assets/logo.png" alt="Logo" className="h-16 mb-2" />
        <h1 className="text-3xl font-bold text-brown-shade">Politique de Confidentialité</h1>
      </div>
      <div className="space-y-6 text-left">
        <section>
          <h2 className="text-xl font-semibold mb-2">Collecte des données</h2>
          <p>Wizi Learn collecte uniquement les données nécessaires à la gestion de votre compte, à la fourniture des services et à l'amélioration de la plateforme.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Utilisation des données</h2>
          <p>Les données sont utilisées pour l'administration des formations, la gestion des quiz, le support utilisateur et la communication interne.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Partage des données</h2>
          <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec des partenaires ou sous-traitants uniquement pour la bonne exécution des services, dans le respect de la législation.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Sécurité</h2>
          <p>Wizi Learn met en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
          <p>Conformément au RGPD, vous pouvez demander l'accès, la rectification, l'effacement ou la portabilité de vos données, ainsi que limiter ou vous opposer à leur traitement. Contactez-nous à l'adresse support@wizi-learn.com.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>Pour toute question relative à la confidentialité, contactez notre délégué à la protection des données : support@wizi-learn.com.</p>
        </section>
      </div>
      <footer className="mt-12 text-center text-xs text-gray-500">© {new Date().getFullYear()} Wizi Learn. Tous droits réservés.</footer>
    </div>
  </Layout>
);

export default PolitiqueConfidentialitePage;
