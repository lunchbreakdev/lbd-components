class LbdBreadcrumb extends HTMLElement {
  static register(tagName?: string) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-breadcrumb', LbdBreadcrumb);
    }
  }

  connectedCallback() {
    if (this.navEl.tagName !== 'NAV') {
      this.navEl.setAttribute('role', 'navigation')
    }

    if (
      !this.navEl.hasAttribute('aria-label') &&
      !this.navEl.hasAttribute('aria-labelledby')
    ) {
      this.navEl.setAttribute('aria-label', 'Breadcrumb')
    }

    this.linkEls[this.linkEls.length - 1].setAttribute(
      'aria-current',
      'page',
    )
  }

  get navEl(): HTMLElement {
    return this.querySelector('nav') || this
  }

  get linkEls(): HTMLAnchorElement[] {
    const listEl = this.navEl.querySelector('ol')
    if (!listEl) return []
    return Array.from(listEl.querySelectorAll('a'))
  }
}

LbdBreadcrumb.register()

export { LbdBreadcrumb }
