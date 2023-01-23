export type CacheType = 'memory' | 'redis' | 'disabled';

export interface CacheService {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
  clear(key: string): Promise<void>;
}
