import axios from 'axios';
import { Media, MediaCategory, MediaType } from '@/types/media';

class MediaService {
  private baseUrl: string;
  private imageUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.imageUrl = import.meta.env.VITE_API_URL_IMG;
    if (!this.baseUrl || !this.imageUrl) {
      throw new Error('Environment variables VITE_API_URL and VITE_API_URL_IMG must be defined');
    }
  }

  // Récupérer tous les médias
  async getAllMedias(): Promise<Media[]> {
    const response = await fetch(`${this.baseUrl}/medias`);
    if (!response.ok) {
      throw new Error('Failed to fetch medias');
    }
    return response.json();
  }

  // Récupérer les médias par type
  async getMediasByType(type: MediaType): Promise<Media[]> {
    const response = await fetch(`${this.baseUrl}/medias?type=${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} medias`);
    }
    return response.json();
  }

  // Récupérer les médias par catégorie
  async getMediasByCategory(category: string): Promise<Media[]> {
    const response = await fetch(`${this.baseUrl}/medias?categorie=${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch medias for category ${category}`);
    }
    return response.json();
  }

  // Récupérer les médias d'une formation
  async getFormationMedias(formationId: string): Promise<Media[]> {
    const response = await fetch(`${this.baseUrl}/formations/${formationId}/medias`);
    if (!response.ok) {
      throw new Error(`Failed to fetch medias for formation ${formationId}`);
    }
    return response.json();
  }

  // Récupérer un média spécifique
  async getMediaById(id: string): Promise<Media> {
    const response = await fetch(`${this.baseUrl}/medias/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch media ${id}`);
    }
    return response.json();
  }

  // Récupérer toutes les catégories
  async getCategories(): Promise<MediaCategory[]> {
    const response = await fetch(`${this.baseUrl}/media-categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch media categories');
    }
    return response.json();
  }

  // Créer un nouveau média
  async createMedia(media: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media> {
    const response = await fetch(`${this.baseUrl}/medias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(media),
    });
    if (!response.ok) {
      throw new Error('Failed to create media');
    }
    return response.json();
  }

  // Mettre à jour un média
  async updateMedia(id: string, media: Partial<Media>): Promise<Media> {
    const response = await fetch(`${this.baseUrl}/medias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(media),
    });
    if (!response.ok) {
      throw new Error(`Failed to update media ${id}`);
    }
    return response.json();
  }

  // Supprimer un média
  async deleteMedia(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/medias/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete media ${id}`);
    }
  }

  // Méthodes spécifiques pour les différents types de médias
  async getVideos(): Promise<Media[]> {
    return this.getMediasByType('video');
  }

  async getImages(): Promise<Media[]> {
    return this.getMediasByType('image');
  }

  async getAudios(): Promise<Media[]> {
    return this.getMediasByType('audio');
  }

  async getDocuments(): Promise<Media[]> {
    return this.getMediasByType('document');
  }
}

export const mediaService = new MediaService(); 