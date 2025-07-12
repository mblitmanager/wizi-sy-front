import { Layout } from "@/components/layout/Layout";

const RemerciementsPage = () => (
  <Layout>
    <div className="container mx-auto py-12 px-4 max-w-2xl text-center">
      <h1 className="text-3xl font-bold mb-6 text-brown-shade">Remerciements</h1>
      <p className="text-lg mb-8">Merci pour votre confiance et votre engagement sur la plateforme Wizi Learn.<br />
      Toute l'équipe vous souhaite une excellente expérience d'apprentissage et reste à votre écoute pour toute suggestion ou remarque.</p>
      <div className="mt-8">
        <a href="/" className="bg-amber-600 text-white px-6 py-2 rounded font-semibold hover:bg-amber-700 transition">Retour à l'accueil</a>
      </div>
    </div>
  </Layout>
);

export default RemerciementsPage;
