import { Layout } from "@/components/layout/Layout";

const ManuelPage = () => (
  <Layout>
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-brown-shade">Manuel d'Utilisation</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Connexion</h2>
          <p>Accédez à la plateforme en saisissant vos identifiants sur la page de connexion.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Navigation</h2>
          <p>Utilisez le menu principal pour accéder aux différentes sections : Catalogue, Quiz, Contacts, Profil, etc.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Suivre une formation</h2>
          <p>Sélectionnez une formation dans le catalogue et suivez les modules proposés. Votre progression est enregistrée automatiquement.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Réaliser un quiz</h2>
          <p>Accédez à la section Quiz, choisissez le niveau et répondez aux questions pour tester vos connaissances.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Consulter vos résultats</h2>
          <p>Retrouvez vos scores et votre progression dans la section Profil.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Contacter le support</h2>
          <p>En cas de difficulté, contactez le support via le formulaire ou l'adresse email indiquée dans la section Contacts.</p>
        </section>
      </div>
    </div>
  </Layout>
);

export default ManuelPage;
