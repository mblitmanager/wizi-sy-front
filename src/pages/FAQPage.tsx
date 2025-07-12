import { Layout } from "@/components/layout/Layout";

const FAQPage = () => (
  <Layout>
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-brown-shade">Foire Aux Questions (FAQ)</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Comment accéder aux formations ?</h2>
          <p>Connectez-vous avec vos identifiants, puis rendez-vous dans la section "Catalogue" pour découvrir les formations disponibles.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Comment contacter un formateur ?</h2>
          <p>Vous pouvez retrouver les coordonnées de vos formateurs dans la section "Contacts" de votre tableau de bord.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Comment signaler un problème technique ?</h2>
          <p>Utilisez le formulaire de contact ou contactez le support via l'adresse email fournie dans la section "Contacts".</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Comment fonctionne le système de quiz ?</h2>
          <p>Les quiz sont accessibles depuis la section "Quiz". Répondez aux questions pour gagner des points et suivre votre progression.</p>
        </div>
      </div>
    </div>
  </Layout>
);

export default FAQPage;
