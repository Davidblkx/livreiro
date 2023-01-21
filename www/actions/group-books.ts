import type { LivreiroScrapers } from '../../modules/scraper/mod.ts';
import type { Book } from '../../modules/search.ts';
import { appStore } from '../store/mod.ts';

export interface BookPrice {
  source: keyof typeof LivreiroScrapers;
  price: string;
  url: string;
  refPrice: number;
}

export interface BookDetails {
  title: string;
  author: string;
  pub: string;
  prices: BookPrice[];
  img: string;
}

export function groupBooks(): BookDetails[] {
  const bookList = appStore.getValue('books');
  const res: BookDetails[] = [];

  for (const book of bookList) {
    const detail = res.find((b) =>
      b.title.toLowerCase() === book.title.toLowerCase() &&
      b.author.toLowerCase() === book.author.toLowerCase()
    );
    if (detail) {
      merge(detail, book);
    } else {
      res.push({
        title: book.title,
        author: book.author,
        pub: book.pub,
        img: book.img,
        prices: [getBookPrice(book)],
      });
    }
  }

  return res;
}

function merge(detail: BookDetails, book: Book): void {
  detail.prices.push(getBookPrice(book));
  detail.prices = detail.prices.sort((a, b) => a.refPrice - b.refPrice);
  detail.author = detail.author || book.author;
  detail.pub = detail.pub || book.pub;
  detail.img = detail.img || book.img;
}

function getBookPrice(book: Book): BookPrice {
  return {
    price: book.price,
    source: book.source as keyof typeof LivreiroScrapers,
    url: book.url,
    refPrice: calcRefPrice(book.price),
  };
}

function calcRefPrice(price: string): number {
  return Number(price.replace('€', '').replace(',', '.'));
}
