import { uniqueId } from '@lunchbreakdev/web-component-utils'

class Lbd{%Template%} extends HTMLElement {
  static register(tagName) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-{%template%}', Lbd{%Template%});
    }
  }

  connectedCallback() {

  }
}

Lbd{%Template%}.register()

export { Lbd{%Template%} }
