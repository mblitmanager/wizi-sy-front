import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, Users } from "lucide-react";

const PlatformInfo = () => {
  const tutorials = [
    {
      title: "Débuter sur la plateforme",
      description: "Apprenez à naviguer et à utiliser les fonctionnalités de base",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      title: "Mode entraînement",
      description: "Pratiquez sans pression avec le mode entraînement",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Mode compétition",
      description: "Affrontez d'autres stagiaires en temps réel",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue sur Quizzy Training Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Quizzy Training Hub est votre plateforme d'apprentissage interactive. Notre
              objectif est de rendre l'apprentissage amusant et efficace grâce à des quiz
              interactifs et des formations personnalisées.
            </p>
            <h3>Comment ça marche ?</h3>
            <ul>
              <li>Choisissez une formation dans notre catalogue</li>
              <li>Accédez à des quiz personnalisés pour chaque module</li>
              <li>Suivez votre progression en temps réel</li>
              <li>Compétissez avec d'autres stagiaires</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modes de jeu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {tutorials.map((tutorial, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {tutorial.icon}
                  <h3 className="font-medium">{tutorial.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {tutorial.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/tutorial/${index + 1}`}>En savoir plus</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Notre équipe est là pour vous accompagner dans votre parcours
              d'apprentissage. N'hésitez pas à nous contacter pour toute question.
            </p>
            <Button asChild className="w-full">
              <Link to="/contacts">Contacter le support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformInfo; 