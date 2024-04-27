import { uniqueId } from '@lunchbreakdev/web-component-utils'

class LbdTooltip extends HTMLElement {
  static register(tagName?: string) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-tooltip', LbdTooltip);
    }
  }

  connectedCallback() {
    if (this.shadowRoot) return

    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(document.createElement('slot'))

    if (!this.trigger) return

    const tooltipId = uniqueId('lbd-tooltip-')

    const tooltip = document.createElement('div')
    tooltip.innerText = this.trigger.getAttribute('title')

    tooltip.id = tooltipId
    tooltip.setAttribute('role', 'tooltip')
    tooltip.setAttribute('part', 'tooltip')
    tooltip.setAttribute('hidden', '')

    shadowRoot.appendChild(tooltip)

    this.trigger.addEventListener('mouseenter', this.handleShow)
    this.trigger.addEventListener('mouseleave', this.handleHide)
    this.trigger.addEventListener('focus', this.handleShow)
    this.trigger.addEventListener('blur', this.handleHide)

    this.trigger.setAttribute('aria-describedby', tooltipId)
    this.trigger.setAttribute('data-tooltip-trigger', '')
    this.trigger.removeAttribute('title')
  }

  disconnectedCallback() {
    this.trigger.removeEventListener('mouseenter', this.handleShow)
    this.trigger.removeEventListener('mouseleave', this.handleHide)
    this.trigger.removeEventListener('focus', this.handleShow)
    this.trigger.removeEventListener('blur', this.handleHide)

    if (this.tooltip) {
      this.trigger.setAttribute('title', this.tooltip.innerText)
    }
    this.trigger.removeAttribute('data-tooltip-title')
  }

  handleKeydown = (event: KeyboardEvent) => {
    const keys = ['Escape']

    if (!keys.includes(event.key)) return

    event.preventDefault()

    this.handleHide()
  }

  handleShow = () => {
    this.tooltip?.removeAttribute('hidden')
    document.addEventListener('keydown', this.handleKeydown)
  }

  handleHide = () => {
    this.tooltip?.setAttribute('hidden', '')
    document.removeEventListener('keydown', this.handleKeydown)
  }

  get trigger(): HTMLElement | null {
    return this.querySelector('[title]') || this.querySelector('[data-tooltip-trigger]')
  }

  get tooltip(): HTMLElement {
    return this.shadowRoot.querySelector('[role="tooltip"]')
  }
}

LbdTooltip.register()

export { LbdTooltip }
