import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('lv-header')
export class LivreiroHeader extends LitElement {
  static styles = css`
  div {
    color: var(--color-main);
    font-size: 3rem;
    font-weight: 700;
  }
  `;

  render() {
    return html`<div>Livreiro</div>`;
  }
}
