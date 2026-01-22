import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-8 px-4">
            <Button
                variant="ghost"
                className="mb-6 flex items-center gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" />
                Retour
            </Button>

            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-primary">À propos de Wizi-Learn</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-blue max-w-none dark:prose-invert">
                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Notre Mission</h3>
                            <p>
                                Wizi-Learn est une plateforme d'apprentissage innovante dédiée à la formation professionnelle.
                                Notre objectif est de simplifier l'accès à la connaissance et de rendre l'apprentissage plus engageant et efficace.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Notre Vision</h3>
                            <p>
                                Nous croyons que la formation continue est la clé du succès professionnel.
                                C'est pourquoi nous avons développé une solution qui s'adapte aux besoins des formateurs et des stagiaires.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contactez-nous</h3>
                            <p>
                                Pour toute question ou assistance, n'hésitez pas à contacter notre équipe de support.
                            </p>
                        </section>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AboutPage;
