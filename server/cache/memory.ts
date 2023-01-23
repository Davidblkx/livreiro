import { CacheService } from './model.ts';

export class MemoryCache implements CacheService {
  #map = new Map<string, string>();

  get(key: string): Promise<string | undefined> {
    return Promise.resolve(this.#map.get(key));
  }
  set(key: string, value: string): Promise<void> {
    this.#map.set(key, value);
    return Promise.resolve();
  }
  clear(key: string): Promise<void> {
    this.#map.delete(key);
    return Promise.resolve();
  }
}
