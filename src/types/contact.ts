
export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  poste?: string;
  image_url?: string;
}

export interface ContactResponse {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}
