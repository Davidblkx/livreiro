import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import './header.ts';
import './search.ts';
import './book-list.ts';

export const LivreiroHomeName = 'lv-home';

@customElement(LivreiroHomeName)
export class LivreiroHome extends LitElement {
  static styles = css`
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 15px 50px 30px auto 50px;
    grid-template-areas: 
      "top-bar"
      "header"
      "search-bar"
      "content"
      "footer";
  }

  .top-bar {
    grid-area: top-bar;
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
  }
  `;

  render() {
    return html`
    <div class="container">
      <div class="top-bar"></div>
      <lv-header class="header"></lv-header>
      <lv-search class="search-bar"></lv-search>
      <div class="content">
        <lv-book-list></lv-book-list>
      </div>
      <div class="footer"></div>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [LivreiroHomeName]: LivreiroHome;
  }
}
