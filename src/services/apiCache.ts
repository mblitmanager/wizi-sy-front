import { AxiosInstance } from 'axios';
import { CacheService } from './cache';
import { CACHE_CONFIG } from '@/config/cache';

type RequestConfig = {
  url: string;
  method: string;
  data?: any;
  params?: any;
};

type CacheOptions = {
  ttl?: number;
  invalidateOn?: {
    methods: string[];
    urls: string[];
  }[];
};

export class ApiCache {
  private static instance: ApiCache;
  private cache: CacheService;
  private invalidationRules: Map<string, Set<string>>;

  private constructor() {
    this.cache = CacheService.getInstance();
    this.invalidationRules = new Map();
  }

  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache();
    }
    return ApiCache.instance;
  }

  private generateCacheKey({ url, method, params }: RequestConfig): string {
    return `${method}:${url}${params ? `:${JSON.stringify(params)}` : ''}`;
  }

  private async invalidateRelatedCache(config: RequestConfig): Promise<void> {
    const key = this.generateCacheKey(config);
    const relatedKeys = this.invalidationRules.get(key);
    
    if (relatedKeys) {
      for (const relatedKey of relatedKeys) {
        await this.cache.delete(relatedKey);
      }
    }
  }

  public setupAxiosInterceptors(axiosInstance: AxiosInstance): void {
    // Intercepteur de requête
    axiosInstance.interceptors.request.use(async (config) => {
      if (config.method?.toUpperCase() === 'GET') {
        const cacheKey = this.generateCacheKey({
          url: config.url!,
          method: config.method,
          params: config.params,
        });

        const cachedResponse = this.cache.get(cacheKey);
        if (cachedResponse) {
          // @ts-ignore
          config.adapter = () => Promise.resolve({
            data: cachedResponse,
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
          });
        }
      }
      return config;
    });

    // Intercepteur de réponse
    axiosInstance.interceptors.response.use(
      async (response) => {
        if (response.config.method?.toUpperCase() === 'GET') {
          const cacheKey = this.generateCacheKey({
            url: response.config.url!,
            method: response.config.method,
            params: response.config.params,
          });

          await this.cache.set(
            cacheKey,
            response.data,
            { ttl: CACHE_CONFIG.DURATIONS.MEDIUM }
          );
        } else {
          // Invalider le cache pour les méthodes non-GET
          await this.invalidateRelatedCache({
            url: response.config.url!,
            method: response.config.method!,
            data: response.config.data,
          });
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public addInvalidationRule(config: RequestConfig, cacheOptions: CacheOptions): void {
    if (!cacheOptions.invalidateOn) return;

    const targetKey = this.generateCacheKey(config);
    
    for (const rule of cacheOptions.invalidateOn) {
      for (const method of rule.methods) {
        for (const url of rule.urls) {
          const invalidationKey = this.generateCacheKey({ method, url, params: undefined });
          
          if (!this.invalidationRules.has(invalidationKey)) {
            this.invalidationRules.set(invalidationKey, new Set());
          }
          
          this.invalidationRules.get(invalidationKey)?.add(targetKey);
        }
      }
    }
  }

  public clearCache(): void {
    this.cache.clear();
    this.invalidationRules.clear();
  }
}

// Export une instance singleton
export const apiCache = ApiCache.getInstance();