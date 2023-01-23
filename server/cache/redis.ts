import { createClient } from 'https://esm.sh/redis@4.5.1';
import { CacheService } from './model.ts';

export class RedisCache implements CacheService {
  #redis: ReturnType<typeof createClient>;

  constructor() {
    const serverUrl = Deno.env.get('REDIS_SERVER_URL') ?? 'redis://localhost:6379';
    console.log(`using redis server at ${serverUrl}`);

    this.#redis = createClient({
      url: serverUrl,
    });
  }

  async get(key: string): Promise<string | undefined> {
    return await this.#run(async (r) => {
      return await r.get(key) ?? undefined;
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.#run(async (r) => {
      await r.set(key, value);
    });
  }

  async clear(key: string): Promise<void> {
    await this.#run(async (r) => {
      await r.del(key);
    });
  }

  async #run<T>(action: (r: ReturnType<typeof createClient>) => Promise<T>): Promise<T> {
    await this.#ensure();
    const result = await action(this.#redis);
    await this.#close();
    return result;
  }

  async #ensure(): Promise<void> {
    if (this.#redis.isOpen) return;
    await this.#redis.connect();
  }

  async #close(): Promise<void> {
    if (!this.#redis.isOpen) return;
    await this.#redis.disconnect();
  }
}
