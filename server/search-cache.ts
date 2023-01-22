import { SearchQuery, SearchResult } from '../modules/search.ts';

interface SearchCacheValue {
  result: SearchResult;
  timestamp: number;
}

export class SearchCache {
  #maxAge: number;
  #cache: Map<string, SearchCacheValue>;

  constructor(maxAge: number) {
    this.#maxAge = maxAge;
    this.#cache = new Map();
  }

  get(search: SearchQuery): SearchResult | undefined {
    const key = this.#buildQueryKey(search);
    return this.#cache.get(key)?.result;
  }

  set(search: SearchQuery, result: SearchResult): void {
    const key = this.#buildQueryKey(search);
    this.#cache.set(key, {
      result,
      timestamp: Date.now(),
    });
  }

  #buildQueryKey(search: SearchQuery): string {
    return [
      search.query,
      search.scrapers.sort().join('|'),
    ].join('_');
  }
}
