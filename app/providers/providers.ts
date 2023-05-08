import { ProviderMap } from './models.ts';
import { IQueryCacheFactory, QueryCacheFactory } from '../query-cache/mod.ts';

import { bertrandFactory } from './provider.bertrand.ts';
import { wookFactory } from './provider.wook.ts';

let cacheFactory: IQueryCacheFactory | undefined;
const cacheFactoryBuilder = async () => {
  if (!cacheFactory) {
    cacheFactory = await QueryCacheFactory.create();
  }

  return cacheFactory;
};

export const Providers: ProviderMap = {
  bertrand: bertrandFactory(cacheFactoryBuilder),
  wook: wookFactory(cacheFactoryBuilder),
};
