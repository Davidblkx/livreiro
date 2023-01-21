import { SearchQuery, SearchResult } from '../../search.ts';
import { buildScrapItHandler } from '../scrap-it/mod.ts';

export const BertrandScraper = buildScrapItHandler<SearchResult, SearchQuery>({
  books: {
    listItem: '.product-portlet',
    data: {
      title: '.title a.title-lnk',
      author: {
        selector: '.authors a',
        eq: 0,
      },
      price: '.price > .active-price',
      pub: '.publisher',
      url: {
        selector: '.title a.title-lnk',
        attr: 'href',
        convert: (href) => `https://www.bertrand.pt${href}`,
      },
      img: {
        selector: '.product-img .cover .track picture source',
        eq: 0,
        attr: 'srcset',
      },
    },
  },
}, (s) => `https://www.bertrand.pt/pesquisa/${encodeURIComponent(s.query)}`);
