import { IQueryCache, IQueryCacheFactory, QueryEntry, QueryIdBuilder } from './models.ts';
import { Kv, openKv } from './deno-kv.ts';
import { QueryCache } from './cache.ts';
import { Query } from '../models.ts';
import { Logger, logger } from '../logger.ts';

export class QueryCacheFactory implements IQueryCacheFactory {
  #kv: Kv;
  #idBuilder: QueryIdBuilder;
  #cacheDuration: number;
  #logger: Logger;

  constructor({
    kv,
    idBuilder,
    cacheDuration,
    log = logger(),
  }: {
    kv: Kv;
    idBuilder: QueryIdBuilder;
    cacheDuration: number;
    log?: Logger;
  }) {
    this.#kv = kv;
    this.#idBuilder = idBuilder;
    this.#cacheDuration = cacheDuration;
    this.#logger = log;

    this.#logger.debug('QueryCacheFactory created');
  }

  create<T>(name: string, fetch: (q: Query) => Promise<T | undefined>): IQueryCache<T> {
    this.#logger.debug(`QueryCacheFactory.create(${name})`);

    return new QueryCache<T>({
      name,
      readCache: (q: Query) => this.getValidEntry<T>(name, q).then((e) => e?.data),
      writeCache: (q: Query, data: T) => this.saveEntry<T>(name, q, data),
      fetch,
      log: this.#logger,
    });
  }

  async getValidEntry<T>(name: string, query: Query): Promise<QueryEntry<T> | undefined> {
    this.#logger.debug(`QueryCacheFactory.getValidEntry(${name}, ${JSON.stringify(query)})`);
    const id = this.#idBuilder(query);
    const key = [name, id];
    const entry = await this.#kv.get<QueryEntry<T>>(key, { consistency: 'eventual' });
    if (!entry || !entry.value) {
      this.#logger.debug(`QueryCacheFactory: no entry found for ${id}[${name}]`);
      return undefined;
    }

    if (Date.now() - entry.value.created.getTime() > this.#cacheDuration) {
      this.#logger.debug(`QueryCacheFactory: entry for ${id}[${name}] is too old`);
      await this.#kv.delete(key);
      return undefined;
    }

    this.#logger.debug(`QueryCacheFactory: entry for ${id}[${name}] is valid`);
    return entry.value;
  }

  async saveEntry<T>(name: string, query: Query, data: T): Promise<void> {
    this.#logger.debug(`QueryCacheFactory.saveEntry(${name}, ${JSON.stringify(query)})`);
    const id = this.#idBuilder(query);
    const key = [name, id];
    const entry: QueryEntry<T> = {
      domain: name,
      id,
      created: new Date(),
      data,
    };

    await this.#kv.set(key, entry);
    this.#logger.debug(`QueryCacheFactory: entry for ${id}[${name}] saved`);
  }

  static async create(
    cacheDuration: number = 1000 * 60 * 60 * 24 * 1, // 1 day
    idBuilder: QueryIdBuilder = DEFAULT_ID_BUILDER,
    log: Logger = logger(),
  ): Promise<IQueryCacheFactory> {
    const kv = await openKv();
    return new QueryCacheFactory({ kv, idBuilder, cacheDuration, log });
  }
}

export const DEFAULT_ID_BUILDER: QueryIdBuilder = (q: Query) => q.searchText.toLowerCase();
