import { ScrapItHandler, ScrapItQuery, ScrapItRequestBuilder } from './models.ts';
import ScrapItRun from 'https://esm.sh/scrape-it@5.3.2?bundle';

export function buildScrapItHandler<T, R>(
  query: ScrapItQuery<T>,
  requestBuilder: ScrapItRequestBuilder<R>,
): ScrapItHandler<T, R> {
  return async (request: R) => {
    const url = await requestBuilder(request);
    // deno-lint-ignore no-explicit-any
    const result = await ScrapItRun(url, query as any);

    if (result.response.statusCode !== 200) {
      const statusCode = result.response.statusCode;
      const statusMessage = result.response.message;

      const errMessage = `Request to ${url} failed with status code ${statusCode} (${statusMessage})`;
      throw new Error(errMessage);
    }

    return result.data as T;
  };
}
