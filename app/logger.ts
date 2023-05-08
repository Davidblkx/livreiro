import { getLogger } from '$deno/log/mod.ts';

export const LIVREIRO_APP_LOGGER = 'livreiro_mod';

export function logger() {
  return getLogger(LIVREIRO_APP_LOGGER);
}

export type { Logger } from '$deno/log/mod.ts';
