export interface Formation {
    id: number;
    titre: string;
    description: string;
    duree: string;
    tarif: string;
    statut: number;
    image_url: string;
    formation: {
        id: number;
        titre: string;
        categorie: string;
        icon: string | null;
    };
}

export interface Formateur {
    id: number;
    civilite: string | null;
    prenom: string;
    nom: string;
    telephone: string;
    image: string | null;
    formations: Formation[];
}
