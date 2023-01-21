import { SearchQuery, SearchResult } from '../../search.ts';
import { buildScrapItHandler } from '../scrap-it/mod.ts';

export const WookScraper = buildScrapItHandler<SearchResult, SearchQuery>({
  books: {
    listItem: '.product',
    data: {
      title: '.title a.title-lnk',
      author: {
        selector: '.autor a',
        eq: 0,
      },
      price: {
        selector: '.preco',
        eq: 0,
      },
      pub: '.publisher',
      url: {
        selector: '.title a.title-lnk',
        attr: 'href',
        convert: (href) => `https://www.wook.pt${href}`,
      },
      img: {
        selector: '.cover img',
        eq: 0,
        attr: 'src',
        convert: (src) => src?.replace('/20x', '/170x') ?? '',
      },
      source: {
        selector: '.title a.title-lnk',
        convert: () => 'Wook',
      },
    },
  },
}, (s) => `https://www.wook.pt/pesquisa/${encodeURIComponent(s.query)}`);
