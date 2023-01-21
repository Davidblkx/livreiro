import { JSONObject } from './models.ts';
import { debounceTime, Observable, Subject } from 'rxjs';
import { loadState, persistState } from './persist.ts';

export class Store<T extends JSONObject> {
  #state: T;
  #proxy: T;
  #listners = new Map<keyof T, Subject<T[keyof T]>>();
  #keyChange = new Subject<keyof T>();

  constructor(data: T) {
    const state = loadState();
    this.#state = { ...data, ...state };
    this.#proxy = this.#createProxy(data);
    this.#keyChange
      .pipe(debounceTime(300))
      .subscribe(() => persistState(this.#state));
  }

  value(): T {
    return this.#proxy;
  }

  listen<K extends keyof T>(key: K): Observable<T[K]> {
    return this.#getObserver(key);
  }

  onKeyChange(): Observable<keyof T> {
    return this.#keyChange;
  }

  replaceState(data: T): void {
    this.#state = data;
  }

  getValue<K extends keyof T>(key: K): T[K] {
    return this.#state[key];
  }

  setValue<K extends keyof T>(key: K, value: T[K]): boolean {
    if (this.#state[key] == value) return false;
    this.#state[key] = value;
    this.#keyChange.next(key);
    this.#listners.get(key)?.next(value);
    return true;
  }

  #getObserver<K extends keyof T>(key: K): Subject<T[K]> {
    if (!this.#listners.has(key)) {
      this.#listners.set(key, new Subject<T[keyof T]>());
    }

    return this.#listners.get(key)! as unknown as Subject<T[K]>;
  }

  #createProxy(data: T): T {
    return new Proxy(data, {
      get: (_, key) => {
        return this.getValue(key as keyof T);
      },
      set: (_, key, value) => {
        return this.setValue(key as keyof T, value as T[keyof T]);
      },
    });
  }
}
