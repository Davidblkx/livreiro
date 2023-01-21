import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Book } from '../../modules/search.ts';

const ELEMENT_NAME = 'lv-book';

@customElement(ELEMENT_NAME)
export class BookComponent extends LitElement {
  static styles = css`
    .book {
      color: var(--color-txt);
      text-decoration: none;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      min-width: 500px;
      max-width: 500px;
      border: 2px solid var(--color-background);
    }

    .book:hover {
      border: 2px solid var(--color-accent);
    }

    img {
      width: 150px;
      max-width: 150px;
    }

    .book__img {
      flex: 0 0 150px;
    }

    .book__info {
      flex: 1;
      padding-top: 3px;
      padding-left: 15px;
    }

    .book__title {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 3px;
    }

    @media only screen and (max-width: 600px) {
      .book {
        min-width: 300px;
        max-width: 100%;
      }
    }
  `;

  @property({ type: Object })
  book: Book = {
    title: '',
    author: '',
    img: '',
    price: '',
    pub: '',
    url: '',
  };

  render() {
    if (!this.book?.url) return html`<div class="book empty"></div>`;

    return html`<a class="book" href="${this.book.url}" target="__blank">
      <div class="book__img">
        <img src="${this.book.img}" />
      </div>
      <div class="book__info">
        <div class="book__title">${this.book.title}</div>
        <div class="book__author">${this.book.author}</div>
        <div class="book__pub">${this.book.pub}</div>
        <div class="book__price">${this.book.price}</div>
      </div>
    </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: BookComponent;
  }
}
