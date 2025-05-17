export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  role: string;
  poste?: string;
  image_url?: string;
}

export interface ContactResponse {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}
