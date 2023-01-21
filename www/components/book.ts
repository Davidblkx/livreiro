import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BookDetails } from '../actions/group-books.ts';

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

    .book__prices {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .book__price {
      text-decoration: none;
      color: var(--color-txt);
      margin-right: 7px;
      min-width: 140px;
    }

    .book__price > span {
      font-size: 1.2em;
    }

    .book__price:hover {
      color: var(--color-accent);
    }

    @media only screen and (max-width: 600px) {
      .book {
        min-width: 300px;
        max-width: 100%;
      }
    }
  `;

  @property({ type: Object })
  book: BookDetails = {
    title: '',
    author: '',
    img: '',
    pub: '',
    prices: [],
  };

  render() {
    if (!this.book?.prices?.length) return html`<div class="book empty"></div>`;

    const prices = this.book.prices.map((p) =>
      html`
    <a href="${p.url}" class="book__price"><span>> ${p.price} - ${p.source}</span></a>`
    );

    return html`<div class="book">
      <div class="book__img">
        <img src="${this.book.img}" />
      </div>
      <div class="book__info">
        <div class="book__title">${this.book.title}</div>
        <div class="book__author">${this.book.author}</div>
        <div class="book__pub">${this.book.pub}</div>
        <div class="book__prices">${prices}</div>
      </div>
  </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: BookComponent;
  }
}
