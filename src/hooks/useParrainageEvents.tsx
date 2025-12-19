// hooks/useParrainageEvents.ts
import axiosInstance from "@/services/axios";
import { useState, useEffect } from "react";

interface ParrainageEvent {
  id: number;
  titre: string;
  prix: string;
  status: string;
  date_debut: string;
  date_fin: string;
  created_at: string;
  updated_at: string;
}

// Cache en mémoire
let cachedEvents: ParrainageEvent[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useParrainageEvents() {
  const [events, setEvents] = useState<ParrainageEvent[]>(cachedEvents || []);
  const [loading, setLoading] = useState(!cachedEvents);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      // ✅ Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem("token");
      if (!token) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Utiliser le cache si valide
      if (
        cachedEvents &&
        cacheTimestamp &&
        Date.now() - cacheTimestamp < CACHE_DURATION
      ) {
        setEvents(cachedEvents);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/parrainage-events");
        // console.log("Réponse API:", response.data);

        if (response.data.success) {
          const newEvents = response.data.data || [];
          setEvents(newEvents);

          // Mettre en cache
          cachedEvents = newEvents;
          cacheTimestamp = Date.now();
        }
      } catch (err: any) {
        console.error("Erreur:", err);

        // ✅ Gérer spécifiquement les erreurs 401
        if (err.response?.status === 401) {
          setError("Non authentifié");
          setEvents([]);
        } else {
          setError("Impossible de charger les événements");
        }

        // En cas d'erreur, utiliser le cache si disponible
        if (cachedEvents) {
          setEvents(cachedEvents);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
