import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Subscription } from 'rxjs';
import { appStore } from '../store/mod.ts';

import './header.ts';
import './search.ts';
import './book-list.ts';

export const LivreiroHomeName = 'lv-home';

@customElement(LivreiroHomeName)
export class LivreiroHome extends LitElement {
  #sub?: Subscription;

  @state()
  __hasContent = false;

  connectedCallback() {
    super.connectedCallback();

    this.#sub?.unsubscribe();
    this.#sub = appStore.listen('books').subscribe((list) => this.__hasContent = list.length > 0);
    this.__hasContent = appStore.getValue('books').length > 0;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#sub?.unsubscribe();
  }

  render() {
    return html`
    <div class=${this.__hasContent ? 'container' : 'container empty'}>
      <div class="top-bar"></div>
      <lv-header styleClass=${this.__hasContent ? 'normal' : 'big'} class="header"></lv-header>
      <lv-search styleClass=${this.__hasContent ? 'normal' : 'big'} class="search-bar"></lv-search>
      <div class="content">
        <lv-book-list></lv-book-list>
      </div>
      <div class="footer"></div>
    </div>
    `;
  }

  static styles = css`
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 15px 50px 35px auto 30px;
    grid-template-areas: 
      "top-bar"
      "header"
      "search-bar"
      "content"
      "footer";
  }

  .container.empty {
    grid-template-rows: 15px 30% 120px 90px auto 30px;
    grid-template-areas: 
      "top-bar"
      "sapce1"
      "header"
      "search-bar"
      "sapce2"
      "footer";
  }

  .container.empty .content {
    display: none;
  }

  .top-bar {
    grid-area: top-bar;
  }

  .container.empty .top-bar {
    grid-area: top-bar;
    background-color: var(--color-main);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .header {
    grid-area: header;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-bar {
    grid-area: search-bar;
  }

  .content {
    grid-area: content;
    max-width: 100%;
    overflow-y: auto;
    scrollbar-color: var(--color-accent) var(--color-background);
    padding: 5px;
  }

  ::-webkit-scrollbar {
    color: red;
    width: 10px;
  }

  ::-webkit-scrollbar-button {
    background-color: var(--color-background);
  }
  ::-webkit-scrollbar-track {
    background-color: var(--color-background);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: var(--color-background);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--color-accent);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-corner {
    background-color: var(--color-background);
  }
  ::-webkit-resizer {
    background-color: var(--color-background);
  }


  .footer {
    grid-area: footer;
    background-color: var(--color-main);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [LivreiroHomeName]: LivreiroHome;
  }
}
