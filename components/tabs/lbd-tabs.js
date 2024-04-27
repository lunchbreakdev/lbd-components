import { uniqueId } from '@lunchbreakdev/web-component-utils'

class LbdTabs extends HTMLElement {
  static attrs = {
    vertical: 'vertical'
  }

  static register(tagName) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-tabs', LbdTabs);
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
      const panelId = tab.getAttribute('href').slice(1)
      const panel = document.getElementById(panelId)

      if (!panel) return

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
    this.listEl.removeEventListener('keydown', this.handleKeydown)

    this.linkEls.forEach((tab) =>
      tab.removeEventListener('click', this.handleClick),
    )
  }

  setNewTab = (el) => {
    const panelId = el.getAttribute('href').slice(1)
    const panel = document.getElementById(panelId)

    el.setAttribute('aria-selected', 'true')
    el.removeAttribute('tabindex')
    el.focus()

    panel.removeAttribute('hidden')
  }

  handleKeydown = (event) => {
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

    this.currentTab.setAttribute('tabindex', '-1')
    this.currentPanel.setAttribute('hidden', '')
    this.currentTab.setAttribute('aria-selected', 'false')

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

  handleClick = (event) => {
    event.preventDefault()

    if (this.currentTab === event.target) return

    this.currentTab.setAttribute('aria-selected', 'false')
    this.currentTab.setAttribute('tabindex', '-1')
    this.currentPanel.setAttribute('hidden', '')

    this.setNewTab(event.target)
  }

  get listEl() {
    return this.querySelector('ol')
  }

  get linkEls() {
    if (!this.listEl) return []
    return Array.from(this.listEl.querySelectorAll('a[href^="#"]'))
  }

  get vertical() {
    return this.hasAttribute(LbdTabs.attrs.vertical)
  }

  get currentTab() {
    return this.listEl.querySelector(
      'a[href^="#"][aria-selected="true"]',
    )
  }

  get currentPanel() {
    return document.getElementById(this.currentTab.getAttribute('href').slice(1))
  }
}

LbdTabs.register()

export { LbdTabs }
