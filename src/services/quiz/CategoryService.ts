
import apiClient from '@/lib/api-client';
import type { Category } from '@/types/quiz';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('/quiz/categories');
      console.log('API Response for categories:', response.data);
      
      const categories = response.data.data || response.data || [];
      
      return categories.map(category => ({
        id: category.id,
        name: category.name || category.nom || '',
        color: category.color || category.couleur || '#3B82F6',
        icon: category.icon || category.icone || '',
        description: category.description || '',
        quizCount: category.quizCount || category.quiz_count || 0,
        colorClass: category.colorClass || ''
      }));
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      return [];
    }
  }
}

export const categoryService = new CategoryService();
