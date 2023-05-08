import { Query, StoreBook } from '../models.ts';
import { IQueryCacheFactory } from '../query-cache/mod.ts';

export type ProviderQuery = {
  name: string;
  query: Query;
  response: Promise<StoreBook[]>;
};

export type Provider = (query: Query) => Promise<ProviderQuery>;

export type ProviderFactory = (queryCacheFactory: () => Promise<IQueryCacheFactory>) => Provider;

export type ProviderMap = {
  bertrand: Provider;
  wook: Provider;
};

export type ProviderName = keyof ProviderMap;
