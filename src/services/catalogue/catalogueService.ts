import axiosInstance from "../axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com";

export interface Formation {
  id: number;
  titre: string;
  description: string;
  prerequis: string;
  image_url: string;
  tarif: string;
  certification: string;
  statut: number;
  duree: string;
  formation_id: number;
  created_at: string;
  updated_at: string;
  formation: {
    id: number;
    titre: string;
    slug: string | null;
    description: string;
    categorie: string;
    icon: string | null;
    image: string | null;
    statut: number;
    duree: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CatalogueResponse {
  current_page: number;
  data: Formation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const catalogueService = {
  async getFormations(page = 1): Promise<CatalogueResponse> {
    const response = await axiosInstance.get(
      `/catalogueFormations/formations?page=${page}`
    );
    return response.data;
  },

  async getCategories(): Promise<
    { id: number; name: string; description: string; count: number }[]
  > {
    const response = await this.getFormations(1);
    const categoriesMap = new Map<
      string,
      { id: number; name: string; description: string; count: number }
    >();

    response.data.forEach((formation) => {
      const catName = formation.formation.categorie;
      if (categoriesMap.has(catName)) {
        const existing = categoriesMap.get(catName)!;
        categoriesMap.set(catName, {
          ...existing,
          count: existing.count + 1,
        });
      } else {
        categoriesMap.set(catName, {
          id: formation.formation.id,
          name: catName,
          description: formation.formation.description,
          count: 1,
        });
      }
    });

    return Array.from(categoriesMap.values());
  },

  getFullImageUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${VITE_API_URL}/${path.replace(/^\/+/, "")}`;
  },
};

export default catalogueService;
