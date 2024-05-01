import { uniqueId } from '../../utils/uniqueId'

class LbdTabs extends HTMLElement {
  static attrs = {
    vertical: 'vertical',
  }

  static register(tagName?: string) {
    const tag = tagName || 'lbd-tabs'

    if ('customElements' in window && !customElements.get(tag)) {
      customElements.define(tag, LbdTabs)
    }
  }

  connectedCallback() {
    if (!this.listEl) return

    this.listEl.setAttribute('role', 'tablist')

    if (this.vertical) {
      this.listEl.setAttribute('aria-orientation', 'vertical')
    }

    this.listEl.addEventListener('keydown', this.handleKeydown)

    this.linkEls.forEach((tab, i) => {
      const id = tab.id || uniqueId('lbd-tab')
      const panelId = tab.getAttribute('href')?.slice(1)
      const panel = panelId ? document.getElementById(panelId) : null

      if (!panel || !panelId) return

      tab.id = id
      tab.setAttribute('role', 'tab')
      tab.setAttribute('aria-selected', String(i === 0))
      tab.setAttribute('aria-controls', panelId)

      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', '0')
      panel.setAttribute('aria-labelledby', id)

      if (i !== 0) {
        tab.setAttribute('tabindex', '-1')
        panel.setAttribute('hidden', '')
      }

      tab.addEventListener('click', this.handleClick)
    })
  }

  disconnectedCallback() {
    this.listEl?.removeEventListener('keydown', this.handleKeydown)

    this.linkEls.forEach((tab) =>
      tab.removeEventListener('click', this.handleClick),
    )
  }

  setNewTab = (el: HTMLElement) => {
    const panelId = el.getAttribute('href')?.slice(1)
    const panel = panelId ? document.getElementById(panelId) : null

    el.setAttribute('aria-selected', 'true')
    el.removeAttribute('tabindex')
    el.focus()

    panel?.removeAttribute('hidden')
  }

  handleKeydown = (event: KeyboardEvent) => {
    const keys = ['Home', 'End']

    if (this.vertical) {
      keys.push('ArrowUp', 'ArrowDown')
    } else {
      keys.push('ArrowLeft', 'ArrowRight')
    }

    if (!keys.includes(event.key)) return

    const currentIdx = this.linkEls.findIndex((t) => t === this.currentTab)
    const firstTab = this.linkEls[0]
    const lastTab = this.linkEls[this.linkEls.length - 1]

    this.currentTab?.setAttribute('tabindex', '-1')
    this.currentPanel?.setAttribute('hidden', '')
    this.currentTab?.setAttribute('aria-selected', 'false')

    switch (event.key) {
      case 'ArrowLeft':
        if (currentIdx === 0) {
          this.setNewTab(lastTab)
        } else {
          this.setNewTab(this.linkEls[currentIdx - 1])
        }
        break

      case 'ArrowUp':
        if (currentIdx === 0) {
          this.setNewTab(lastTab)
        } else {
          this.setNewTab(this.linkEls[currentIdx - 1])
        }
        break

      case 'ArrowRight':
        if (currentIdx === this.linkEls.length - 1) {
          this.setNewTab(firstTab)
        } else {
          this.setNewTab(this.linkEls[currentIdx + 1])
        }
        break

      case 'ArrowDown':
        if (currentIdx === this.linkEls.length - 1) {
          this.setNewTab(firstTab)
        } else {
          this.setNewTab(this.linkEls[currentIdx + 1])
        }
        break

      case 'Home':
        this.setNewTab(firstTab)
        break

      case 'End':
        this.setNewTab(lastTab)
        break

      default:
        break
    }
  }

  handleClick = (event: MouseEvent) => {
    event.preventDefault()

    if (this.currentTab === event.target) return

    this.currentPanel?.setAttribute('hidden', '')
    this.currentTab?.setAttribute('aria-selected', 'false')
    this.currentTab?.setAttribute('tabindex', '-1')

    this.setNewTab(event.target as HTMLElement)
  }

  get listEl(): HTMLOListElement | null {
    return this.querySelector('ol')
  }

  get linkEls(): HTMLAnchorElement[] {
    if (!this.listEl) return []
    return Array.from(this.listEl.querySelectorAll('a[href^="#"]'))
  }

  get vertical(): boolean {
    return this.hasAttribute(LbdTabs.attrs.vertical)
  }

  get currentTab(): HTMLAnchorElement | null | undefined {
    return this.listEl?.querySelector('a[href^="#"][aria-selected="true"]')
  }

  get currentPanel(): HTMLElement | null {
    const panelId = this.currentTab?.getAttribute('href')?.slice(1)

    if (!panelId) return null

    return document.getElementById(panelId)
  }
}

LbdTabs.register()

export { LbdTabs }
