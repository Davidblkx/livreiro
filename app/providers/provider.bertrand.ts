import { ProviderFactory } from './models.ts';
import { Scrapers } from '../scraper/scraper.ts';
import { buildProviderFactory } from './factory.ts';

export const bertrandFactory: ProviderFactory = (queryCacheFactory) =>
  buildProviderFactory(
    'bertrand',
    queryCacheFactory,
    (q) => Scrapers.bertrand(q).then((r) => r.books),
  );
