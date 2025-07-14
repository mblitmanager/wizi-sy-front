import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import logo from "../assets/logo.png";

const sections = [
	{
		key: "quiz",
		label: "Quiz",
		content: (
			<>
				<h2 className="text-xl font-semibold mb-2">Quiz</h2>
				<p className="mb-4">La section Quiz vous permet de tester vos connaissances et de progresser par niveaux :</p>
				<ul className="list-disc pl-5 mb-4">
					<li>Commencez avec 2 quiz débutants pour vous échauffer.</li>
					{/* <li>À 10 points : tous les quiz débutants deviennent accessibles.</li> */}
					<li>À 20 points : les quiz intermédiaires s'ouvrent à vous.</li>
					{/* <li>À 40 points : tous les quiz débutants et intermédiaires sont disponibles.</li> */}
					<li>À 50 points : les premiers quiz avancés sont débloqués.</li>
					{/* <li>À 80 points : accédez à encore plus de quiz avancés.</li> */}
					<li>À 100 points : tous les quiz sont à votre portée !</li>
				</ul>
				<div className="mb-4">
					<h3 className="text-lg font-semibold mb-2">Mode de jeu par niveau</h3>
					<ul className="list-disc pl-5">
						<li>
							<strong>Débutant</strong>
							<ul className="list-square pl-5">
								{/* <li>question audio</li>
								<li>choix multiples</li>
								<li>vrai/faux</li> */}
							</ul>
							<div className="mt-2 text-sm text-gray-700">
								<strong>Comment jouer :</strong> Pour les quiz <span className="font-semibold">choix multiples</span>,{" "}
								<span className="font-semibold">vrai/faux</span> et <span className="font-semibold">question audio</span>, il suffit de sélectionner la ou les bonnes réponses proposées. Validez ensuite votre choix pour passer à la question suivante.
							</div>
						</li>
						<li>
							<strong>Intermédiaire</strong> <span className="text-xs">(+ les précédents)</span>
							<ul className="list-square pl-5">
								{/* <li>banque de mots</li>
								<li>correspondance</li>
								<li>carte flash</li> */}
							</ul>
							<div className="mt-2 text-sm text-gray-700">
								<strong>Comment jouer :</strong>
								<ul className="list-disc pl-5">
									<li><span className="font-semibold">Banque de mots :</span> Sélectionnez dans la liste les bonnes réponses parmi les mots proposés.</li>
									<li><span className="font-semibold">Correspondance :</span> Faites correspondre chaque valeur de gauche avec celle de droite en les associant correctement.</li>
									<li><span className="font-semibold">Carte flash :</span> Cliquez sur la carte pour révéler la question, puis sélectionnez la bonne réponse.</li>
								</ul>
							</div>
						</li>
						<li>
							<strong>Avancé</strong> <span className="text-xs">(+ les précédents)</span>
							<ul className="list-square pl-5">
								{/* <li>rearrangement</li>
								<li>remplir le champ vide</li> */}
							</ul>
							<div className="mt-2 text-sm text-gray-700">
								<strong>Comment jouer :</strong>
								<ul className="list-disc pl-5">
									<li><span className="font-semibold">Rearrangement :</span> Ré-ordonnez la liste d'éléments pour obtenir la bonne séquence.</li>
									<li><span className="font-semibold">Remplir le champ vide :</span> Analysez l'énoncé et remplissez la case correspondante avec la bonne réponse.</li>
								</ul>
							</div>
						</li>
					</ul>
				</div>
				<p className="mb-2">Un tutoriel interactif s'affiche lors de votre première visite pour vous expliquer le fonctionnement et la progression.</p>
				<p className="text-yellow-900 text-sm">Seul votre meilleur score est conservé. N'hésitez pas à recommencer pour décrocher la note parfaite ! Chaque réponse compte : accumulez des points et explorez tout l'univers des quiz.</p>
			</>
		),
	},
	{
		key: "tutoriels",
		label: "Tutoriels",
		content: (
			<>
				<h2 className="text-xl font-semibold mb-2">Tutoriels et astuces</h2>
				<div className="mb-4">
					<h3 className="text-lg font-semibold mb-1">Installer l'application en mode PWA</h3>
					<ul className="list-disc pl-5 mb-2">
						<li><strong>Sur Android :</strong> Ouvrez le site dans Chrome, cliquez sur le menu (⋮) puis sur "Ajouter à l'écran d'accueil". L'application sera installée comme une app native.</li>
						<li><strong>Sur iOS :</strong> Ouvrez le site dans Safari, cliquez sur l'icône de partage (carré avec flèche), puis sur "Sur l'écran d'accueil". Validez pour installer l'application sur votre iPhone/iPad.</li>
					</ul>
				</div>
				<div className="mb-4">
					<h3 className="text-lg font-semibold mb-1">Installer l'application Android (APK)</h3>
					<ul className="list-disc pl-5 mb-2">
						<li>Téléchargez l'APK depuis l'accueil (bouton "Télécharger pour Android").</li>
						<li>Ouvrez le fichier téléchargé. Si un message "Installation bloquée" ou "Source inconnue" apparaît, cliquez sur <strong>Paramètres</strong> ou <strong>Autoriser</strong>.</li>
						<li>Activez "Autoriser l'installation depuis cette source" puis revenez à l'installation et validez.</li>
						<li>L'application est sûre et ne collecte aucune donnée personnelle en dehors de votre usage sur Wizi Learn.</li>
					</ul>
				</div>
				<p>Des tutoriels et astuces s'affichent automatiquement lors de la première utilisation de certaines fonctionnalités (quiz, installation de l'application, etc.). Vous pouvez aussi consulter les astuces en cliquant sur les liens dédiés.</p>
			</>
		),
	},
	{
		key: "formation",
		label: "Formation",
		content: (
			<>
				<h2 className="text-xl font-semibold mb-2">Formation</h2>
				<p>Sélectionnez une formation dans le catalogue et suivez les modules proposés. Votre progression est enregistrée automatiquement.</p>
			</>
		),
	},
	{
		key: "classement",
		label: "Classement",
		content: (
			<>
				<h2 className="text-xl font-semibold mb-2">Classement</h2>
				<p>Consultez votre position dans le classement général depuis la section dédiée. Le classement est basé sur vos points accumulés dans les quiz et formations.</p>
			</>
		),
	},
	{
		key: "parrainage",
		label: "Parrainage",
		content: (
			<>
				<h2 className="text-xl font-semibold mb-2">Parrainage</h2>
				<p>Partagez votre lien de parrainage depuis la page d'accueil pour inviter vos amis. <strong>Vous gagnez 50€ à chaque inscription validée.</strong></p>
				<p>Un <strong>lien unique</strong> est généré pour chaque parrainage. Ce lien redirige votre filleul vers une page dédiée où il peut sélectionner la formation de son choix pour une première inscription.</p>
				<p>Après l'inscription, votre filleul recevra un mail de confirmation et sera contacté par la suite par votre conseiller pour finaliser son accompagnement.</p>
				<p>Sur la page de parrainage, vous pouvez consulter la liste de vos filleuls ainsi que vos gains cumulés.</p>
			</>
		),
	},
];

const ManuelPage = () => {
	const [activeSection, setActiveSection] = useState(sections[0].key);

  return (
	<Layout>
	  <div className="container mx-auto py-8 px-4">
		<div className="flex flex-col items-center mb-6">
		  <img src="/assets/logo.png" alt="Wizi Learn Logo" className="h-16 mb-2" />
		  <h1 className="text-3xl font-bold text-brown-shade">Manuel d'utilisation</h1>
		</div>
				{/* Menu interactif */}
				<nav className="mb-8 flex flex-wrap gap-4 justify-center">
					{sections.map((section) => (
						<button
							key={section.key}
							className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-200 ${activeSection === section.key ? "bg-brown-shade text-white" : "bg-gray-100 text-brown-shade hover:bg-brown-shade hover:text-white"}`}
							onClick={() => setActiveSection(section.key)}
						>
							{section.label}
						</button>
					))}
				</nav>
				<div className="bg-white rounded shadow p-6 min-h-[200px]">
					{sections.find((s) => s.key === activeSection)?.content}
				</div>
		<footer className="mt-12 text-center text-xs text-gray-500">© {new Date().getFullYear()} Wizi Learn. Tous droits réservés.</footer>
	  </div>
	</Layout>
	);
};

export default ManuelPage;
