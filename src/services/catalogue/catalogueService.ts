import axios from "axios";
import { Category, FormationCardData } from "@/types/Formation";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Fetch an array of FormationCardData from the backend.
 * @returns An array of FormationCardData
 * @throws {Error} If the request fails
 */
async function fetchFormations(): Promise<FormationCardData[]> {
  try {
    const response = await axios.get(`${VITE_API_URL}/formationParrainage`);
    return response.data;
  } catch (error) {
    console.error("Error fetching formations:", error);
    throw new Error("Failed to fetch formations");
  }
}

/**
 * Process an array of FormationCardData and return an array of Category.
 * For each category, count the number of formations that belong to it.
 * @param formations The array of FormationCardData
 * @returns An array of Category
 */
function processCategories(formations: FormationCardData[]): Category[] {
  const categoriesMap = new Map<string, Category>();

  formations.forEach((formation) => {
    const catName = formation.formation.categorie;
    const existing = categoriesMap.get(catName);

    if (existing) {
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
}

const catalogueService = {
  getFormations: fetchFormations,
  async getCategories(): Promise<Category[]> {
    try {
      const formationsData = await fetchFormations();
      return processCategories(formationsData);
    } catch (error) {
      console.error("Error in getCategories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  /**
   * Constructs a full URL for an image path.
   *
   * @param path - The image path, which may be relative or an absolute URL.
   * @returns The full URL to the image. If the path is an absolute URL, it is returned as-is.
   *          If the path is empty or undefined, an empty string is returned.
   *          Otherwise, the path is appended to the base API URL.
   */
  getFullImageUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${VITE_API_URL}/${path.replace(/^\/+/, "")}`;
  },
};

export default catalogueService;
