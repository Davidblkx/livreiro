import { appStore } from '../store/mod.ts';
import { SearchQuery, SearchResult } from '../../modules/search.ts';

export async function executeSearch(): Promise<void> {
  const query = appStore.getValue('search');
  const scrapers = appStore.getValue('scrapers');
  if (query.length < 3 || !scrapers.length) return;

  appStore.setValue('books', []);
  const search: SearchQuery = { query, scrapers };

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(search),
  });

  const result = await response.json() as SearchResult;
  appStore.setValue('books', result.books);
}
