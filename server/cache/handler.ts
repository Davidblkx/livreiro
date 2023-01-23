import { SearchQuery, SearchResult } from '../../modules/search.ts';
import { MemoryCache } from './memory.ts';
import { CacheService, CacheType } from './model.ts';
import { RedisCache } from './redis.ts';

interface SearchCacheValue {
  result: SearchResult;
  timestamp: number;
}

export class CacheHandler {
  #service: CacheService;
  #maxAge: number;

  /**
   * Create a new cache handler instance
   *
   * @param service cache service
   * @param maxAge time to keep cache in seconds
   */
  constructor(service: CacheService, maxAge: number) {
    this.#service = service;
    this.#maxAge = maxAge;
  }

  public async get(service: string, search: SearchQuery): Promise<SearchResult | undefined> {
    try {
      const key = await this.#buildKey(search, service);

      const cachedString = await this.#service.get(key);
      if (!cachedString) return undefined;

      const cached = JSON.parse(cachedString) as SearchCacheValue;
      if (cached.timestamp + this.#maxAge < Date.now()) {
        await this.#service.clear(key);
        return undefined;
      }

      return cached.result;
    } catch (e) {
      console.error('CACHE', e);
    }
  }

  public async set(service: string, search: SearchQuery, result: SearchResult): Promise<void> {
    try {
      const key = await this.#buildKey(search, service);
      const value = JSON.stringify({
        result,
        timestamp: Date.now(),
      });

      await this.#service.set(key, value);
    } catch (e) {
      console.error('CACHE', e);
    }
  }

  async #buildKey(q: SearchQuery, service: string): Promise<string> {
    const data = [
      service,
      q.query,
      q.scrapers.sort().join('|'),
    ].join('_').toLowerCase();
    const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(data));
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  static create(type: CacheType, maxAge: number): CacheHandler | undefined {
    switch (type) {
      case 'memory':
        return new CacheHandler(new MemoryCache(), maxAge);
      case 'redis':
        return new CacheHandler(new RedisCache(), maxAge);
      case 'disabled':
        return undefined;
    }
  }
}
