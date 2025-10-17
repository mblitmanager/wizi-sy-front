import { Formation } from ".";

export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  role: string;
  type: string;
  civilite?: string;
  image?: string;
  poste?: string;
  image_url?: string;
  formation?: Formation[];
  formations?: Formation[];
}

export interface ContactResponse {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
  poleSav?: Contact[];
}
