const spinbuttonTemplate = document.createElement('template')

spinbuttonTemplate.innerHTML = `
  <button data-key="increase">+</button>
  <div data-key="prev"></div>
  <div data-key="spinbutton"></div>
  <div data-key="next"></div>
  <button data-key="decrease">-</button>
`

spinbuttonTemplate.id = 'lbd-spinbutton-template'

if (!document.getElementById(spinbuttonTemplate.id)) {
  document.body.appendChild(spinbuttonTemplate)
}

class LbdSpinbutton extends HTMLElement {
  static attrs = {
    descending: 'descending',
    expanded: 'expanded',
    infinite: 'infinite',
    steps: 'steps',
  }

  static register(tagName?: string) {
    const tag = tagName || 'lbd-spinbutton'

    if ('customElements' in window && !customElements.get(tag)) {
      customElements.define(tag, LbdSpinbutton)
    }
  }

  connectedCallback() {
    if (!this.selectEl || this.shadowRoot || !this.template) return

    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(this.template.content.cloneNode(true))
    shadowRoot.appendChild(document.createElement('slot'))

    this.addEventListener('keydown', this.handleKeydown)

    this.selectEl.setAttribute('hidden', '')
    this._observer.observe(this.selectEl, {
      attributes: true,
      attributeFilter: ['selected', 'hidden'],
      childList: true,
      subtree: true,
    })

    this.increaseButton?.setAttribute('type', 'button')
    this.increaseButton?.setAttribute('part', 'increase')
    this.increaseButton?.setAttribute('tabindex', '-1')
    this.increaseButton?.addEventListener('click', () => this.increase())

    this.prevExpanded?.setAttribute('part', 'prev')
    this.prevExpanded?.setAttribute('aria-hidden', 'true')
    if (!this.expanded) this.prevExpanded?.setAttribute('hidden', '')

    this.spinbutton?.setAttribute('role', 'spinbutton')
    this.spinbutton?.setAttribute('part', 'spinbutton')
    this.spinbutton?.setAttribute('tabindex', '0')
    this.spinbutton?.setAttribute('aria-valuenow', this.selectedOption.value)
    this.spinbutton?.setAttribute(
      'aria-valuetext',
      this.selectedOption.innerText,
    )
    this.spinbutton?.setAttribute(
      'aria-valuemin',
      !this.descending
        ? this.optionEls[0].value
        : this.optionEls[this.optionEls.length - 1].value,
    )
    this.spinbutton?.setAttribute(
      'aria-valuemax',
      !this.descending
        ? this.optionEls[this.optionEls.length - 1].value
        : this.optionEls[0].value,
    )
    if (this.spinbutton) {
      this.spinbutton.innerText = this.selectedOption.innerText
    }

    this.nextExpanded?.setAttribute('part', 'next')
    this.nextExpanded?.setAttribute('aria-hidden', 'true')
    if (!this.expanded) this.nextExpanded?.setAttribute('hidden', '')

    this.decreaseButton?.setAttribute('type', 'button')
    this.decreaseButton?.setAttribute('part', 'decrease')
    this.decreaseButton?.setAttribute('tabindex', '-1')
    this.decreaseButton?.addEventListener('click', () => this.decrease())

    this.updateExpanded()
  }

  disconnectedCallback() {
    this._observer.disconnect()
    this.increaseButton?.removeEventListener('click', () => this.increase())
    this.decreaseButton?.removeEventListener('click', () => this.decrease())
  }

  updateExpanded() {
    if (!this.expanded || (!this.prevExpanded && !this.nextExpanded)) return

    if (this.infinite) {
      this.prevExpanded.innerHTML =
        this.selectedOptionIndex === 0
          ? this.optionEls[this.optionEls.length - 1].innerText
          : this.optionEls[this.selectedOptionIndex - 1].innerText
    } else {
      this.prevExpanded.innerHTML =
        this.selectedOptionIndex === 0
          ? '&nbsp;'
          : this.optionEls[this.selectedOptionIndex - 1].innerText
    }

    if (this.infinite) {
      this.nextExpanded.innerHTML =
        this.selectedOptionIndex === this.optionEls.length - 1
          ? this.optionEls[0].innerText
          : this.optionEls[this.selectedOptionIndex + 1].innerText
    } else {
      this.nextExpanded.innerHTML =
        this.selectedOptionIndex === this.optionEls.length - 1
          ? '&nbsp;'
          : this.optionEls[this.selectedOptionIndex + 1].innerText
    }
  }

  increase(amount = 1) {
    if (this.selectedOptionIndex < 0) return

    let prevOption: HTMLOptionElement

    if (this.infinite && this.selectedOptionIndex === 0) {
      prevOption = this.optionEls[this.optionEls.length - 1]
    } else if (this.selectedOptionIndex - amount > 0) {
      prevOption = this.optionEls[this.selectedOptionIndex - amount]
    } else {
      prevOption = this.optionEls[0]
    }

    if (prevOption === this.selectedOption) return

    this.selectedOption.removeAttribute('selected')
    prevOption.setAttribute('selected', '')

    this.updateExpanded()
  }

  decrease(amount = 1) {
    if (this.selectedOptionIndex < 0) return

    let nextOption: HTMLOptionElement

    if (
      this.infinite &&
      this.selectedOptionIndex === this.optionEls.length - 1
    ) {
      nextOption = this.optionEls[0]
    } else if (this.selectedOptionIndex < this.optionEls.length - amount) {
      nextOption = this.optionEls[this.selectedOptionIndex + amount]
    } else {
      nextOption = this.optionEls[this.optionEls.length - 1]
    }

    if (nextOption === this.selectedOption) return

    this.selectedOption.removeAttribute('selected')
    nextOption.setAttribute('selected', '')

    this.updateExpanded()
  }

  handleKeydown(event: KeyboardEvent) {
    const keys = ['ArrowDown', 'ArrowUp', 'PageUp', 'PageDown', 'Home', 'End']

    if (!keys.includes(event.key)) return

    event.preventDefault()

    switch (event.key) {
      case 'ArrowDown':
        this.decrease()
        break

      case 'ArrowUp':
        this.increase()
        break

      case 'PageDown':
        this.decrease(this.steps)
        break

      case 'PageUp':
        this.increase(this.steps)
        break

      case 'Home':
        this.selectedOption.removeAttribute('selected')
        this.optionEls[0].setAttribute('selected', '')
        this.updateExpanded()
        break

      case 'End':
        this.selectedOption.removeAttribute('selected')
        this.optionEls[this.optionEls.length - 1].setAttribute('selected', '')
        this.updateExpanded()
        break

      default:
        break
    }
  }

  _observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'selected') {
        const target = mutation.target as HTMLOptionElement

        if (!target.hasAttribute('selected')) return

        this.spinbutton.setAttribute('aria-valuenow', target.value)
        this.spinbutton.setAttribute('aria-valuetext', target.innerText)
        this.spinbutton.innerText = target.innerText
      }

      if (
        mutation.attributeName === 'hidden' &&
        (mutation.target as HTMLElement).getAttribute('hidden') !== ''
      ) {
        this.selectEl.setAttribute('hidden', '')

        this.updateExpanded()
      }
    })
  })

  get template(): HTMLTemplateElement {
    return document.getElementById(
      this.getAttribute('template') || `${this.localName}-template`,
    ) as HTMLTemplateElement
  }

  get selectEl(): HTMLSelectElement {
    return this.querySelector('select')
  }

  get optionEls(): HTMLOptionElement[] {
    return Array.from(this.selectEl.querySelectorAll('option')).sort((a, b) =>
      !this.descending
        ? Number(a.value) - Number(b.value)
        : Number(b.value) - Number(a.value),
    )
  }

  get selectedOption(): HTMLOptionElement {
    const selectedOption = this.selectEl.querySelector(
      'option[selected]',
    ) as HTMLOptionElement

    if (selectedOption) return selectedOption

    this.optionEls[0].setAttribute('selected', '')

    return this.optionEls[0]
  }

  get selectedOptionIndex(): number {
    return this.optionEls.findIndex((o) => o === this.selectedOption)
  }

  get increaseButton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="increase"]')
  }

  get prevExpanded(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="prev"]')
  }

  get spinbutton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="spinbutton"]')
  }

  get nextExpanded(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="next"]')
  }

  get decreaseButton(): HTMLElement | null {
    return this.shadowRoot.querySelector('[data-key="decrease"]')
  }

  get descending(): boolean {
    return this.hasAttribute(LbdSpinbutton.attrs.descending)
  }

  get expanded(): boolean {
    return this.hasAttribute(LbdSpinbutton.attrs.expanded)
  }

  get infinite(): boolean {
    return this.hasAttribute(LbdSpinbutton.attrs.infinite)
  }

  get steps(): number | undefined {
    if (!this.hasAttribute(LbdSpinbutton.attrs.steps)) return 5

    return Number(this.getAttribute(LbdSpinbutton.attrs.steps))
  }
}

LbdSpinbutton.register()

export { LbdSpinbutton }
