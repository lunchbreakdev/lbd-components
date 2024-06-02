import { uniqueId } from '../../utils/uniqueId'

class LbdTooltip extends HTMLElement {
  static register(tagName?: string) {
    const tag = tagName || 'lbd-tooltip'

    if ('customElements' in window && !customElements.get(tag)) {
      customElements.define(tag, LbdTooltip)
    }
  }

  connectedCallback() {
    if (this.shadowRoot) return

    const shadowRoot = this.attachShadow({ mode: 'open' })

    if (!this.trigger) return

    const tooltipId = uniqueId('lbd-tooltip-')

    shadowRoot.innerHTML = `
      <slot></slot>
      <div
        id="${tooltipId}"
        role="tooltip"
        part="tooltip"
        hidden
      >
        ${this.trigger.getAttribute('title')}
      </div>
    `

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
    return (
      this.querySelector('[title]') ||
      this.querySelector('[data-tooltip-trigger]')
    )
  }

  get tooltip(): HTMLElement {
    return this.shadowRoot.querySelector('[role="tooltip"]')
  }
}

LbdTooltip.register()

export { LbdTooltip }
