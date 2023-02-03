import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lv-header')
export class LivreiroHeader extends LitElement {
  @property()
  styleClass = 'normal';

  render() {
    return html`
      <div class="container">
        <img class=${'logo ' + this.styleClass} src="/assets/imgs/livreiro.svg" alt="Livreiro logo" />
        <div class=${'title ' + this.styleClass} >Livreiro</div>
      </div>
    `;
  }

  static styles = css`
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 35px;
    margin-right: 10px;
  }

  .logo.big {
    height: 100px;
  }

  .title {
    color: var(--color-theme);
    font-size: 3rem;
    font-weight: 700;
  }

  .title.big {
    font-size: 4rem;
  }
  `;
}
