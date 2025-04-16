export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  formations?: string[];
  avatar: string;
  created_at: string;
  specialites?: string[];
}

export interface ContactsData {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}
