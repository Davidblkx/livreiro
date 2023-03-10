import type { LivreiroScrapers } from './scraper/mod.ts';

export type Book = {
  title: string;
  author: string;
  price: string;
  pub: string;
  url: string;
  img: string;
  source: string;
};

export interface SearchResult {
  books: Book[];
}

export interface SearchQuery {
  query: string;
  scrapers: (keyof typeof LivreiroScrapers)[];
}

export interface SearchOptions {
  scrapers: (keyof typeof LivreiroScrapers)[];
}
