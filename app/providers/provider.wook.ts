import { ProviderFactory } from './models.ts';
import { Scrapers } from '../scraper/scraper.ts';
import { buildProviderFactory } from './factory.ts';

export const wookFactory: ProviderFactory = (queryCacheFactory) =>
  buildProviderFactory(
    'wook',
    queryCacheFactory,
    (q) => Scrapers.wook(q).then((r) => r.books),
  );
