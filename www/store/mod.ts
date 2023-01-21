import { Store } from './store.ts';
import { Book } from '../../modules/search.ts';
import type { LivreiroScrapers } from '../../modules/scraper/mod.ts';

export type AppState = {
  search: string;
  books: Book[];
  scrapers: (keyof typeof LivreiroScrapers)[];
};

export const appStore = new Store<AppState>({
  search: '',
  books: [],
  scrapers: ['bertrand', 'wook'],
});

// TODO: Remove this when the source select is implemented
appStore.setValue('scrapers', ['bertrand', 'wook']);
