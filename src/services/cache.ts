interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private defaultConfig: CacheConfig = {
    ttl: 1000 * 60 * 60, // 1 hour by default
  };

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, data: T, config?: Partial<CacheConfig>): void {
    const ttl = config?.ttl ?? this.defaultConfig.ttl;
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public clear(): void {
    this.cache.clear();
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}