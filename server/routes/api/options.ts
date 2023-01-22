import { API_PREFIX } from './model.ts';
import { RouteConfig } from '../model.ts';
import { LivreiroScrapers } from '../../../modules/scraper/mod.ts';
import { SearchOptions } from '../../../modules/search.ts';

export const registerApiOptionsRoute: RouteConfig = (_, router) => {
  router.get(API_PREFIX + '/options', (ctx) => {
    const searchOptions: SearchOptions = {
      scrapers: Object.keys(LivreiroScrapers) as (keyof typeof LivreiroScrapers)[],
    };
    ctx.response.body = searchOptions;
    ctx.response.headers.set('Content-Type', 'application/json');
    ctx.response.headers.set('Cache-Control', `public, max-age=${60 * 60 * 24}`);
  });
};
