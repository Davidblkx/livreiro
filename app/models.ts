export type Book = {
  title: string;
  author: string;
};

export type StoreBook = Book & {
  price: string;
  url: string;
  img?: string;
  pub?: string;
  isbn?: string;
};

export type Query = {
  searchText: string;
};
