import { Query } from '../models.ts';

export type QueryEntry<T> = {
  domain: string;
  id: string;
  created: Date;
  data: T;
};

export type QueryIdBuilder = (q: Query) => string;

export interface IQueryCache<T> {
  readonly name: string;
  execute(query: Query): Promise<T | undefined>;
}

export interface IQueryCacheFactory {
  create<T>(name: string, fetch: (q: Query) => Promise<T | undefined>): IQueryCache<T>;
}
