import { Users } from "lucide-react";
import { Formateur } from "./types";
import { FormateurFormationsModal } from "./FormateurFormationsModal";

interface FormateursTableProps {
    formateurs: Formateur[];
}

export function FormateursTable({ formateurs }: FormateursTableProps) {
    const formatName = (prenom: string, nom: string): string => {
        if (!nom || nom.trim().length === 0) return prenom || "";
        if (!prenom || prenom.trim().length === 0) return nom || "";

        const firstLetter = nom.charAt(0).toUpperCase();
        return `${firstLetter}. ${prenom}`;
    };

    if (!formateurs || formateurs.length === 0) {
        return (
            <span className="text-gray-400 dark:text-gray-500 text-sm">
                Aucun formateur
            </span>
        );
    }

    return (
        <div className="space-y-2">
            {formateurs.map((formateur) => (
                <div
                    key={formateur.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <Users className="h-3 w-3 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {formatName(formateur.prenom, formateur.nom)}
                            </span>
                            {/* <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formateur.formations?.length ?? 0} formation(s)
                            </div> */}
                        </div>
                    </div>
                    <FormateurFormationsModal formateur={formateur} />
                </div>
            ))}
        </div>
    );
}
