import { API_PREFIX } from './model.ts';
import { RouteConfig } from '../model.ts';
import { LivreiroScrapers } from '../../../modules/scraper/mod.ts';
import { SearchQuery, SearchResult } from '../../../modules/search.ts';
import { SearchCache } from '../../search-cache.ts';

// 24h
const cache = new SearchCache(1000 * 60 * 60 * 24);

export const registerApiSearchRoute: RouteConfig = (_, router) => {
  router.post(API_PREFIX + '/search', async (ctx) => {
    const query = await ctx.request.body().value as unknown;
    if (!isSearchQuery(query)) {
      ctx.response.status = 400;
      ctx.response.body = 'Invalid query';
      return;
    }

    const result: SearchResult = {
      books: [],
    };

    for (const target of query.scrapers) {
      const targetResult = await executeSearch(target, query);
      result.books.push(...targetResult.books);
    }

    ctx.response.body = result;
    ctx.response.headers.set('Content-Type', 'application/json');
  });
};

function isSearchQuery(query: unknown): query is SearchQuery {
  return typeof query === 'object' && query !== null && 'query' in query;
}

async function executeSearch(target: keyof typeof LivreiroScrapers, query: SearchQuery): Promise<SearchResult> {
  try {
    const cacheResult = cache.get(query);
    if (cacheResult) {
      console.log(`using cached result for ${target}`);
      return cacheResult;
    }

    console.log(`executing request for ${target}`);
    const result = await LivreiroScrapers[target](query);
    cache.set(query, result);
    return result;
  } catch (err) {
    console.error(`failed to execute search for ${target}`);
    console.error(err);
    return { books: [] };
  }
}
