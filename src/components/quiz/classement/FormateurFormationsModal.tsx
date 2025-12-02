import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    Clock,
    FileText,
    ArrowRight,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Formateur } from "./types";

interface FormateurFormationsModalProps {
    formateur: Formateur;
}

export function FormateurFormationsModal({ formateur }: FormateurFormationsModalProps) {
    const navigate = useNavigate();

    const getCategoryColor = useCallback((category?: string): string => {
        switch (category) {
            case "Bureautique":
                return "#3D9BE9";
            case "Langues":
                return "#A55E6E";
            case "Internet":
                return "#FFC533";
            case "Création":
                return "#9392BE";
            case "IA":
                return "#ABDA96";
            default:
                return "#E0E0E0";
        }
    }, []);

    const getCategoryButtonColor = useCallback((category?: string): string => {
        switch (category) {
            case "Bureautique":
                return "bg-[#3D9BE9] hover:bg-[#3D9BE9] text-white border-[#3D9BE9]";
            case "Langues":
                return "bg-[#A55E6E] hover:bg-[#A55E6E] text-white border-[#A55E6E]";
            case "Internet":
                return "bg-[#FFC533] hover:bg-[#FFC533] text-white border-[#FFC533]";
            case "Création":
                return "bg-[#9392BE] hover:bg-[#9392BE] text-white border-[#9392BE]";
            case "IA":
                return "bg-[#ABDA96] hover:bg-[#ABDA96] text-white border-[#ABDA96]";
            default:
                return "bg-gray-600 hover:bg-gray-700 text-white border-gray-600";
        }
    }, []);

    const getCategoryBadgeColor = useCallback((category?: string): string => {
        switch (category) {
            case "Bureautique":
                return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
            case "Langues":
                return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
            case "Internet":
                return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
            case "Création":
                return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
            case "IA":
                return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
        }
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300 dark:hover:text-orange-200 transition-all duration-200">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Voir formation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0 border border-gray-200 dark:border-gray-700 shadow-xl">
                {/* En-tête avec fond simple */}
                <div className="bg-blue-600 text-white p-6">
                    <DialogHeader className="text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl font-bold">
                                Formation proposée par {formateur.prenom} {formateur.nom.toUpperCase()}
                            </DialogTitle>
                        </div>
                        {/* <p className="text-blue-100 text-sm opacity-90">
                            Découvrez l'ensemble des formations dispensées par ce formateur
                        </p> */}
                    </DialogHeader>
                </div>

                {/* Contenu avec défilement */}
                <div className="max-h-[60vh] overflow-y-auto p-6 bg-white dark:bg-gray-900">
                    {!formateur.formations || formateur.formations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Aucune formation disponible
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">
                                Ce formateur n'a pas encore de formations attribuées
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {formateur.formations.map((formation) => {
                                const category = formation.formation?.categorie;
                                const buttonColorClass = getCategoryButtonColor(category);

                                return (
                                    <Card
                                        key={formation.id}
                                        className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                                        {/* Barre de couleur en haut */}
                                        <div
                                            className="h-2"
                                            style={{
                                                backgroundColor: getCategoryColor(category),
                                            }}
                                        />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                                        style={{
                                                            backgroundColor: getCategoryColor(category),
                                                        }}>
                                                        <BookOpen className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                                            {formation.titre ||
                                                                formation.formation?.titre ||
                                                                "Formation sans titre"}
                                                        </CardTitle>
                                                        <Badge
                                                            className={`mt-2 ${getCategoryBadgeColor(
                                                                category
                                                            )}`}>
                                                            {category || "Non catégorisé"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-4">
                                            <div
                                                className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        formation.description ||
                                                        "Aucune description disponible",
                                                }}
                                            />

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        Durée : {formation.duree || "Non spécifiée"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${formation.statut === 1
                                                            ? "bg-green-500"
                                                            : formation.statut === 0
                                                                ? "bg-yellow-500"
                                                                : "bg-gray-500"
                                                            }`}
                                                    />
                                                    <span
                                                        className={
                                                            formation.statut === 1
                                                                ? "text-green-600 dark:text-green-400"
                                                                : formation.statut === 0
                                                                    ? "text-yellow-600 dark:text-yellow-400"
                                                                    : "text-gray-500"
                                                        }>
                                                        {formation.statut === 1
                                                            ? "Activée"
                                                            : formation.statut === 0
                                                                ? "Désactivée"
                                                                : "Statut inconnu"}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                className={`w-full mt-4 ${buttonColorClass}`}
                                                onClick={() => {
                                                    navigate(`/catalogue-formation/${formation.id}`);
                                                }}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Voir les détails
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
