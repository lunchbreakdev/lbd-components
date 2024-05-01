import { uniqueId } from '../../utils/uniqueId'

class Lbd{%Template%} extends HTMLElement {
  static register(tagName?: string) {
    const tag = tagName || 'lbd-{%template%}'

    if ('customElements' in window && !customElements.get(tag)) {
      customElements.define(tag, Lbd{%Template%});
    }
  }

  connectedCallback() {

  }
}

Lbd{%Template%}.register()

export { Lbd{%Template%} }
