export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  nom?: string;
  prenom?: string;
  email: string;
  phone?: string;
  role: string;
  type: string;
  poste?: string;
  image_url?: string;
}

export interface ContactResponse {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}
