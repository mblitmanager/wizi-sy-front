
export interface Sponsorship {
  id: number;
  code: string;
  url: string;
  utilisations: number;
  bonus: number;
  statut: boolean;
  created_at: string;
  updated_at: string;
}

export interface FilleulResponse {
  id: number;
  nom: string;
  prenom: string;
  inscription_date: string;
  statut: string;
  bonus_attribue: boolean;
}

export interface SponsorshipResponse {
  sponsorship: Sponsorship;
  filleuls: FilleulResponse[];
}

export interface Referral {
  id: number;
  name: string;
  date: string;
  status: string;
  bonusAwarded: boolean;
}

export interface SponsorshipStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingBonus: number;
  earnedBonus: number;
}

export interface SponsorshipLink {
  code: string;
  url: string;
  usage: number;
}
