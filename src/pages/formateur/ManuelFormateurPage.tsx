import { Layout } from "@/components/layout/Layout";
import { useState } from "react";

const sections = [
  {
    key: "installation",
    label: "Installation",
    content: (
      <>
        <h2 className="text-xl font-semibold mb-4">Installation de l'application</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Ce guide vous accompagne dans l'installation de l'application mobile Wizi-learn sur votre appareil Android.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mt-6">📥 Étape 1 : Téléchargement</h3>
          <p>
            L'application est fournie sous forme de fichier APK. Cliquez sur le lien de téléchargement fourni par votre administrateur. 
            Si un avertissement apparaît, choisissez <strong>"Télécharger quand même"</strong>.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mt-6">⚙️ Étape 2 : Google Play Protect</h3>
          <p>
            Si une fenêtre <strong>"Installation bloquée par Play Protect"</strong> apparaît :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cliquez sur <strong>"Plus de détails"</strong>.</li>
            <li>Cliquez ensuite sur <strong>"Installer quand même"</strong>.</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mt-6">🚀 Étape 3 : Installation</h3>
          <p>
            Cliquez sur <strong>Installer</strong>. Si un message "Envoyé pour analyse ?" apparaît, cliquez sur <strong>"Ne pas envoyer"</strong>.
          </p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">🌐 Alternative Web Mobile (Sans APK)</h3>
          <p>
            Si vous préférez utiliser la version Web sur votre téléphone sans télécharger de fichier APK :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ouvrez <strong>Chrome</strong> sur votre mobile et allez sur le site.</li>
            <li>Cliquez sur les <strong>trois points (⋮)</strong> en haut à droite.</li>
            <li>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong>.</li>
            <li>L'icône Wizi-learn apparaîtra alors comme une application classique, sans aucun avertissement de sécurité.</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    key: "interface",
    label: "Interface & Usage",
    content: (
      <>
        <h2 className="text-xl font-semibold mb-4">Guide de l'Interface</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="text-lg font-medium text-gray-900">🏠 Tableau de Bord</h3>
          <p>
            Visualisez vos statistiques clés (Total stagiaires, Actifs, Score moyen) et gérez les alertes critiques via la section dédiée en haut de page.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mt-4">🧭 Navigation</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Menu Bas</strong> : Basculez entre les Stats, Stagiaires, Tâches et Configuration.</li>
            <li><strong>Menu Latéral</strong> : Accédez à la gestion complète (Quiz, Classement, Vidéos).</li>
            <li><strong>Bouton Orange (+)</strong> : Accès rapide pour envoyer un message ou créer un quiz.</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mt-4">👥 Suivi Stagiaires</h3>
          <p>
            Dans "Progress Trainee", chaque carte affiche la progression circulaire (en %) et le score moyen de l'élève. Cliquez sur une carte pour voir les détails.
          </p>
        </div>
      </>
    ),
  },
];

const ManuelFormateurPage = () => {
  const [activeTab, setActiveTab] = useState(sections[0].key);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Guide Formateur</h1>
          <p className="text-gray-500 mt-2">Tout ce qu'il faut savoir pour maîtriser Wizi-learn</p>
        </div>

        <div className="flex border-b border-gray-200 mb-8">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveTab(section.key)}
              className={`py-4 px-6 text-sm font-medium transition-colors relative ${
                activeTab === section.key
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {sections.find((s) => s.key === activeTab)?.content}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-400">
          Wizi-learn Formateur Guide v1.0
        </footer>
      </div>
    </Layout>
  );
};

export default ManuelFormateurPage;
