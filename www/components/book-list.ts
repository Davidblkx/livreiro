import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Book } from '../../modules/search.ts';
import { appStore } from '../store/mod.ts';
import { Subscription } from 'rxjs';

import './book.ts';

const ELEMENT_NAME = 'lv-book-list';

@customElement(ELEMENT_NAME)
export class BookListComponent extends LitElement {
  static styles = css`
    .book-list {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }

    .book-list > * {
      margin: 5px;
    }

    @media only screen and (max-width: 1024px) {
      .book-list {
        justify-content: center;
        align-items: center;
      }
    }
  `;

  #sub?: Subscription;

  connectedCallback() {
    super.connectedCallback();

    this.#sub?.unsubscribe();
    this.#sub = appStore.listen('books').subscribe((l) => this.__books = l);
    this.__books = appStore.getValue('books');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#sub?.unsubscribe();
  }

  @state()
  __books: Book[] = [];

  render() {
    const bookList = appStore.getValue('books');

    const htmlBooks = bookList.map((book: Book) => html`<lv-book .book=${book}></lv-book>`);

    return html`<div class="book-list">${htmlBooks}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: BookListComponent;
  }
}
