
export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  photo?: string;
}

export interface ContactsData {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}
