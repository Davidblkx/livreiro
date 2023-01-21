export type ScrapItPropObject<T = string> = {
  /** The query selector */
  selector?: string;
  /** Convert value to actual type */
  convert?: (value?: string) => T;
  /** Trim value, defaults to false */
  trim?: boolean;
  /** returns the first ancestor of the given element. */
  closest?: string;
  /** returns the nth element. */
  eq?: number;
  /** it will select the nth direct text child. Deep text child selection is not possible yet.  */
  texteq?: number;
  /** select value from attribute */
  attr?: string;
};

export type ScrapItProp<T = string> = string | ScrapItPropObject<T>;

export type ScrapItListItem<T> = {
  listItem: string;
  data?: {
    [key in keyof T]: T[key] extends Array<infer U> ? ScrapItListItem<U>
      : T[key] extends string ? ScrapItProp<string>
      : ScrapItPropObject<T[key]>;
  };
};

export type ScrapItQuery<T> = {
  [key in keyof T]: T[key] extends Array<infer U> ? ScrapItListItem<U>
    : T[key] extends string ? ScrapItProp<string>
    : ScrapItPropObject<T[key]>;
};

export type ScrapItRequestBuilder<T> = (data: T) => string | Promise<string>;

export type ScrapItHandler<T, R> = (request: R) => Promise<T>;
