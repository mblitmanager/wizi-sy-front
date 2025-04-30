
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class QuizApiService {
  private static instance: QuizApiService;

  private constructor() {}

  public static getInstance(): QuizApiService {
    if (!QuizApiService.instance) {
      QuizApiService.instance = new QuizApiService();
    }
    return QuizApiService.instance;
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get(endpoint: string) {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting from ${endpoint}:`, error);
      throw error;
    }
  }
}

export const quizApiService = QuizApiService.getInstance();
