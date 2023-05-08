// TODO: Delete this after unstable/deno-kv is merged into deno
export type Kv = {
  close(): Promise<void>;
  delete(key: KvKey): Promise<void>;
  get<T = unknown>(key: KvKey, options?: { consistency?: KvConsistencyLevel }): Promise<KvEntryMaybe<T>>;
  list<T = unknown>(selector: KvListSelector, options?: KvListOptions): KvListIterator<T>;
  set(key: KvKey, value: unknown): Promise<KvCommitResult>;
  getMany<T = unknown>(keys: KvKey[], options?: { consistency?: KvConsistencyLevel }): Promise<KvEntryMaybe<T>[]>;
};

export type KvKeyPart =
  | Uint8Array
  | string
  | number
  | bigint
  | boolean;

export type KvListSelector =
  | { prefix: KvKey }
  | { prefix: KvKey; start: KvKey }
  | { prefix: KvKey; end: KvKey }
  | { start: KvKey; end: KvKey };

export type KvListOptions = {
  limit?: number;
  cursor?: string;
  reverse?: boolean;
  consistency?: KvConsistencyLevel;
  batchSize?: number;
};

export type KvKey = readonly KvKeyPart[];

export type KvConsistencyLevel = 'strong' | 'eventual';

export type KvEntryMaybe<T> = KvEntry<T> | { key: KvKey; value: null; versionstamp: null };

export type KvEntry<T> = { key: KvKey; value: T; versionstamp: string };

export type KvListIterator<T> = AsyncIterableIterator<KvEntry<T>> & {
  cursor: string;
};

export type KvCommitResult = { versionstamp: string; ok: true } | { ok: false };

export function openKv(path?: string): Promise<Kv> {
  return (Deno as unknown as { openKv: (path?: string) => Promise<Kv> }).openKv(path);
}
