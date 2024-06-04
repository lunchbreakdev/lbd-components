import { uniqueId } from '../../utils/uniqueId'

const carouselTemplate = document.createElement('template')

carouselTemplate.innerHTML = `
  <button data-key="toggle">Pause</button>
  <button data-key="prev">&lt;</button>
  <button data-key="next">&gt;</button>
`

carouselTemplate.id = 'lbd-carousel-template'

if (!document.getElementById(carouselTemplate.id)) {
  document.body.appendChild(carouselTemplate)
}

class LbdCarousel extends HTMLElement {
  static attrs = {
    autoplay: 'autoplay',
    controls: 'controls',
    timing: 'timing',
  }

  static register(tagName?: string) {
    const tag = tagName || 'lbd-carousel'

    if ('customElements' in window && !customElements.get(tag)) {
      customElements.define(tag, LbdCarousel)
    }
  }

  connectedCallback() {
    if (this.items.length === 0 || this.shadowRoot) return

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const itemsId = uniqueId('lbd-carousel-')

    shadowRoot.innerHTML = `
      ${this.hasControls ? `<div part="controls"></div>` : ''}
      <div id="${itemsId}" part="items" aria-live="off"><slot></slot></div>
    `

    this.setAttribute('role', 'region')
    this.setAttribute('aria-roledescription', 'carousel')

    this.items.forEach((item, i) => {
      item.setAttribute('role', 'group')
      item.setAttribute('aria-roledescription', 'slide')
      item.setAttribute('aria-label', `${i + 1} of ${this.items.length}`)
      item.setAttribute('hidden', '')
    })

    if (this.selected) {
      this.selected.removeAttribute('hidden')
    } else {
      this.items[0].removeAttribute('hidden')
      this.items[0].setAttribute('data-selected', '')
    }

    if (!this.hasControls) return

    this.controls.appendChild(this.template.content.cloneNode(true))

    if (this.toggleButton && !this.toggleButton.hasAttribute('aria-label')) {
      this.toggleButton.setAttribute(
        'aria-label',
        `${this.autoplay ? 'Stop' : 'Start'} automatic slide show`,
      )
      this.toggleButton?.addEventListener('click', () => {
        if (!this.autoplay) {
          this.play()
        } else {
          this.pause()
        }
      })
    }

    this.prevButton?.setAttribute('aria-controls', itemsId)
    if (this.prevButton && !this.prevButton.hasAttribute('aria-label')) {
      this.prevButton.setAttribute('aria-label', 'Previous Slide')
    }
    this.prevButton?.addEventListener('click', () => this.previous(this))

    this.nextButton?.setAttribute('aria-controls', itemsId)
    if (this.nextButton && !this.nextButton.hasAttribute('aria-label')) {
      this.nextButton.setAttribute('aria-label', 'Next Slide')
    }
    this.nextButton?.addEventListener('click', () => this.next(this))

    if (this.autoplay) this.play()
  }

  disconnectedCallback() {
    this.prevButton?.removeEventListener('click', () => this.previous(this))
    this.nextButton?.removeEventListener('click', () => this.next(this))
  }

  slideInterval: NodeJS.Timeout = null

  play() {
    this.setAttribute('autoplay', '')
    this.itemContainer.setAttribute('aria-live', 'off')
    this.toggleButton.setAttribute('aria-label', 'Stop automatic slide show')
    this.toggleButton.innerHTML = 'Pause'

    this.slideInterval = setInterval(() => {
      this.next(this)
    }, this.timing)
  }

  pause() {
    this.removeAttribute('autoplay')
    this.itemContainer.setAttribute('aria-live', 'polite')
    this.toggleButton.setAttribute('aria-label', 'Start automatic slide show')
    this.toggleButton.innerHTML = 'Start'

    clearInterval(this.slideInterval)
  }

  previous(el: HTMLElement) {
    const items = Array.from(el.children)

    if (!items || items.length === 0) return

    const selected = el.querySelector('[data-selected]')

    const selectedIdx = items.findIndex((item) => item === selected)

    selected.removeAttribute('data-selected')
    selected.setAttribute('hidden', '')

    if (selectedIdx === 0) {
      items[items.length - 1].setAttribute('data-selected', '')
      items[items.length - 1].removeAttribute('hidden')
    } else {
      items[selectedIdx - 1].setAttribute('data-selected', '')
      items[selectedIdx - 1].removeAttribute('hidden')
    }
  }

  next(el: HTMLElement) {
    const items = Array.from(el.children)

    if (!items || items.length === 0) return

    const selected = el.querySelector('[data-selected]')

    const selectedIdx = items.findIndex((item) => item === selected)

    if (selectedIdx < 0) return

    selected.removeAttribute('data-selected')
    selected.setAttribute('hidden', '')

    if (selectedIdx + 1 === items.length) {
      items[0].setAttribute('data-selected', '')
      items[0].removeAttribute('hidden')
    } else {
      items[selectedIdx + 1].setAttribute('data-selected', '')
      items[selectedIdx + 1].removeAttribute('hidden')
    }
  }

  get template(): HTMLTemplateElement {
    return document.getElementById(
      this.getAttribute('template') || `${this.localName}-template`,
    ) as HTMLTemplateElement
  }

  get controls(): HTMLElement {
    return this.shadowRoot.querySelector('[part="controls"]')
  }

  get toggleButton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="toggle"]')
  }

  get prevButton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="prev"]')
  }

  get nextButton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="next"]')
  }

  get itemContainer(): HTMLElement {
    return this.shadowRoot.querySelector('[part="items"]')
  }

  get selected(): HTMLElement | null {
    return this.querySelector('[data-selected]')
  }

  get items() {
    return Array.from(this.children)
  }

  get autoplay(): boolean {
    return this.hasAttribute(LbdCarousel.attrs.autoplay)
  }

  get hasControls(): boolean {
    return (
      !this.hasAttribute(LbdCarousel.attrs.controls) ||
      this.getAttribute(LbdCarousel.attrs.controls) !== 'off'
    )
  }

  get timing(): number | undefined {
    if (!this.hasAttribute(LbdCarousel.attrs.timing)) return 4000

    return Number(this.getAttribute(LbdCarousel.attrs.timing))
  }
}

LbdCarousel.register()

export { LbdCarousel }
