import { Query, StoreBook } from '../models.ts';
import { IQueryCache, IQueryCacheFactory } from '../query-cache/models.ts';
import { Provider } from './models.ts';
import { logger } from '../logger.ts';

const cacheMap = new Map<string, IQueryCache<StoreBook[]>>();

export function buildProviderFactory(
  name: string,
  cacheFactory: () => Promise<IQueryCacheFactory>,
  fetch: (q: Query) => Promise<StoreBook[]>,
): Provider {
  return async (query) => {
    logger().info(`[provider] ${name}: ${JSON.stringify(query)}`);
    let cache = cacheMap.get(name);

    if (!cache) {
      const factory = await cacheFactory();
      cache = factory.create<StoreBook[]>(name, fetch);
      cacheMap.set(name, cache);
    }

    const response = cache.execute(query).then((r) => {
      logger().info(`[provider] ${name}: ${r?.length ?? 0}`);
      return r || [];
    });

    return {
      name,
      query,
      response,
    };
  };
}
