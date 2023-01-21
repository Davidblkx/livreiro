import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { appStore } from '../store/mod.ts';
import { executeSearch } from '../actions/search.ts';

@customElement('lv-search')
export class LivreiroSearch extends LitElement {
  @state()
  private __disabled = true;

  @query('#search')
  private __input!: HTMLInputElement;

  public connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => {
      this.__input.focus();
      this.__input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.__onClick();
        }
      });

      appStore.listen('scrapers').subscribe(() => {
        this.updateDisabled();
      });

      this.__input.value = appStore.getValue('search');
      this.updateDisabled();
    }, 0);
  }

  render() {
    return html`
      <div class="search">
        <input type="text" placeholder="Título, autor, ISBN..." id="search" @input="${this.__onChange}" />
        <button @click="${this.__onClick}" ?disabled="${this.__disabled}">Pesquisar</button>
      </div>`;
  }

  private updateDisabled() {
    this.__disabled = this.__input.value.length <= 3 && appStore.getValue('scrapers').length > 0;
  }

  private __onClick() {
    if (this.__disabled) return;
    appStore.setValue('search', this.__input.value);
    executeSearch();
  }

  private __onChange() {
    this.updateDisabled();
  }

  static styles = css`
.search {
  grid-area: search;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
}

.search > input {
  flex: 1 1 auto;
  border: 2px solid var(--color-main);
  border-radius: 0;
  font-size: 1.1rem;
  background-color: var(--color-main);
  color: var(--color-txt);
  padding: 0;
  padding-left: 3px;
  margin: 0;
  outline: none;
  height: 100%;
  box-sizing: border-box;
}

.search > input:focus {
  border: 2px solid var(--color-accent);
  border-radius: 0;
}

.search > input::placeholder {
  color: var(--color-txt);
  opacity: 0.6;
}

.search > button {
  margin-left: 3px;
  flex: 0 1 auto;
  height: 100%;
  border-radius: 0;
  font-size: 1rem;
  border: none;
  background-color: var(--color-main);
  color: var(--color-txt);
}

.search > button:hover {
  background-color: var(--color-accent);
  color: var(--color-background);
  cursor: pointer;
}

.search > button:disabled {
  background-color: var(--color-main);
  color: var(--color-txt);
  cursor: auto;
  opacity: 0.6;
}

@media only screen and (min-width: 1024px) {
  .search > input {
    max-width: 50%;
  }
}
  `;
}
