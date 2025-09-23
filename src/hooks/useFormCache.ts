import { useCallback, useState } from 'react';
import { z } from 'zod';

interface UseFormCacheOptions<T> {
  key: string;
  initialData?: T;
  validationSchema?: z.ZodType<T>;
}

export function useFormCache<T extends object>({
  key,
  initialData,
  validationSchema,
}: UseFormCacheOptions<T>) {
  const [data, setData] = useState<T>(() => {
    if (typeof window === 'undefined') return initialData as T;
    
    const cached = localStorage.getItem(key);
    if (!cached) return initialData as T;
    
    try {
      const parsed = JSON.parse(cached);
      if (validationSchema) {
        const validated = validationSchema.safeParse(parsed);
        return validated.success ? validated.data : initialData;
      }
      return parsed;
    } catch {
      return initialData;
    }
  });

  const updateData = useCallback((newData: Partial<T>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  }, [key]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(key);
    setData(initialData as T);
  }, [key, initialData]);

  return {
    data,
    updateData,
    clearCache,
  };
}

// Exemple d'utilisation:
// const formCache = useFormCache<FormData>({
//   key: 'contact-form',
//   initialData: { name: '', email: '' },
//   validationSchema: z.object({
//     name: z.string(),
//     email: z.string().email(),
//   }),
// });