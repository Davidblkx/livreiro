import { Query } from '../models.ts';
import { IQueryCache } from './models.ts';
import { Logger, logger } from '../logger.ts';

export class QueryCache<T> implements IQueryCache<T> {
  #readCache: (q: Query) => Promise<T | undefined>;
  #writeCache: (q: Query, data: T) => Promise<void>;
  #fetch: (q: Query) => Promise<T | undefined>;
  #logger: Logger;

  name: string;

  constructor(
    options: {
      name: string;
      readCache: (q: Query) => Promise<T | undefined>;
      writeCache: (q: Query, data: T) => Promise<void>;
      fetch: (q: Query) => Promise<T | undefined>;
      log?: Logger;
    },
  ) {
    this.name = options.name;
    this.#readCache = options.readCache;
    this.#writeCache = options.writeCache;
    this.#fetch = options.fetch;
    this.#logger = options.log || logger();
  }

  async execute(query: Query): Promise<T | undefined> {
    this.#logger.debug(`QueryCache.execute(${this.name}, ${JSON.stringify(query)})`);
    const cached = await this.#readCache(query);
    if (cached) {
      this.#logger.debug(`QueryCache[${this.name}]: cache hit`);
      return cached;
    }

    this.#logger.debug(`QueryCache[${this.name}]: cache miss, fetching`);
    const data = await this.#fetch(query);
    if (!data) {
      this.#logger.debug(`QueryCache[${this.name}]: fetch returned undefined`);
      return undefined;
    }

    this.#logger.debug(`QueryCache[${this.name}]: saving to cache`);
    await this.#writeCache(query, data);
    return data;
  }
}
