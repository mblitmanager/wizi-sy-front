import { useEffect, useState } from 'react';
import { CacheService } from '@/services/cache';

interface UseCachedDataOptions<T> {
  key: string;
  ttl?: number;
  fetcher: () => Promise<T>;
  onError?: (error: Error) => void;
}

export function useCachedData<T>({ 
  key, 
  ttl, 
  fetcher, 
  onError 
}: UseCachedDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheService = CacheService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cachedData = cacheService.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          return;
        }

        // If not in cache, fetch fresh data
        const freshData = await fetcher();
        cacheService.set(key, freshData, { ttl });
        setData(freshData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [key, ttl, fetcher, onError]);

  return { data, isLoading, error };
}