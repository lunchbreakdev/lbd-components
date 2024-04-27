import { uniqueId } from '@lunchbreakdev/web-component-utils'

class LbdDisclosure extends HTMLElement {
  static register(tagName) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-disclosure', LbdDisclosure);
    }
  }

  connectedCallback() {
    if (!this.detailsEl || !this.summaryEl) return

    this._observer.observe(this.detailsEl, {
      attributes: true,
      attributeFilter: ['open']
    })

    const isOpen = this.detailsEl.getAttribute('open') !== null

    const detailsId = this.detailsEl.id || uniqueId('lbd-disclosure-')
    const summaryId = this.summaryEl.id || `${detailsId}summary`

    this.detailsEl.id = detailsId
    this.summaryEl.id = summaryId

    this.detailsEl.setAttribute('aria-labelledby', summaryId)
    this.summaryEl.setAttribute('aria-controls', detailsId)
    this.summaryEl.setAttribute('aria-expanded', String(isOpen))
  }

  disconnectedCallback() {
    this._observer.disconnect()
  }

  _observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isOpen = mutation.target.getAttribute('open') !== null
      this.summaryEl?.setAttribute('aria-expanded', String(isOpen))
    })
  })

  get detailsEl() {
    return this.querySelector('details')
  }

  get summaryEl() {
    return this.detailsEl?.querySelector('summary')
  }
}

LbdDisclosure.register()

export { LbdDisclosure }
