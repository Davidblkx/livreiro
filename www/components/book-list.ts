import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { appStore } from '../store/mod.ts';
import { Subscription } from 'rxjs';
import { BookDetails, groupBooks } from '../actions/group-books.ts';

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
    this.#sub = appStore.listen('books').subscribe(() => this._books = groupBooks());
    this._books = groupBooks();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#sub?.unsubscribe();
  }

  @state()
  _books: BookDetails[] = [];

  render() {
    const htmlBooks = this._books
      // should be based on user preferences
      .sort((a, b) => a.prices[0].refPrice - b.prices[0].refPrice)
      .map((b) => html`<lv-book .book=${b}></lv-book>`);

    return html`<div class="book-list">${htmlBooks}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: BookListComponent;
  }
}
