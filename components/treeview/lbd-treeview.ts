import { uniqueId } from '@lunchbreakdev/web-component-utils'

class LbdTreeview extends HTMLElement {
  static register(tagName?: string) {
    if ('customElements' in window) {
      customElements.define(tagName || 'lbd-treeview', LbdTreeview);
    }
  }

  connectedCallback() {
    if (!this.listEl) return

    const addListAttributes = (el: HTMLElement, level: number) => {
      const items = Array.from(
        el.querySelectorAll(
          this.listItemSelectors
            .map((s) => `:scope > ${s}`)
            .join(','),
        ),
      )

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        item.setAttribute('role', 'treeitem')
        item.setAttribute('aria-level', String(level))
        item.setAttribute('aria-setsize', String(items.length))
        item.setAttribute('aria-posinset', String(i + 1))
        item.setAttribute('aria-selected', 'false')
        item.setAttribute('tabindex', i === 0 && level === 1 ? '0' : '-1')

        item.addEventListener('click', this.toggleSubList)
        item.addEventListener('keydown', this.handleKeydown)
        item.addEventListener('focus', this.handleFocus)

        const subList = item.querySelector(
          this.listSelectors.map((s) => `:scope > ${s}`).join(','),
        ) as HTMLElement | null

        if (!subList) continue

        item.setAttribute('aria-expanded', 'false')

        subList.setAttribute('role', 'group')
        subList.setAttribute('hidden', '')

        addListAttributes(subList, level + 1)
      }
    }

    const prevEl = this.listEl.previousElementSibling as HTMLElement

    const treeId = this.listEl.id || uniqueId('lbd-treeview-')

    this.listEl.setAttribute('role', 'tree')

    addListAttributes(this.listEl, 1)

    if (this.listEl.hasAttribute('label') || this.listEl.hasAttribute('aria-labelledby')) {
      return
    }

    const labelId = `${treeId}--label`

    if (this.hasAttribute('label')) {
      this.id = labelId
      this.listEl.setAttribute('aria-labelledby', labelId)
    } else if (prevEl && this.headingEls.includes(prevEl)) {
      prevEl.id = labelId
      this.listEl.setAttribute('aria-labelledby', labelId)
    }
  }

  disconnectedCallback() {
    const listItems = Array.from(
      this.querySelectorAll('[role="tree"] li'),
    )

    for (const item of listItems) {
      item.removeEventListener('click', this.toggleSubList)
      item.removeEventListener('keydown', this.handleKeydown)
      item.removeEventListener('focus', this.handleFocus)
    }
  }

  toggleSubList = (e: MouseEvent) => {
    const el = e.target as HTMLElement

    if (!el) return

    const expanded = el.getAttribute('aria-expanded') === 'true'

    const rootListEl = el.closest('[role="tree"]')

    if (!rootListEl) return

    const listItems = Array.from(rootListEl.querySelectorAll('li'))

    for (const item of listItems) {
      if (item.getAttribute('aria-selected') !== 'true' || item === el) {
        continue
      }

      item.setAttribute('aria-selected', 'false')
    }

    if (el.hasAttribute('aria-expanded')) {
      el.setAttribute('aria-expanded', String(!expanded))

      const subList = el.querySelector('ul')

      if (!subList) return

      if (expanded) {
        subList.setAttribute('hidden', '')
      } else {
        subList.removeAttribute('hidden')
      }
    }

    el.setAttribute('aria-selected', 'true')
  }

  handleKeydown = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement

    if (!el) return

    const keys = [
      'Enter',
      ' ',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      '*',
    ]

    if (!keys.includes(e.key) && e.code !== `Key${e.key.toUpperCase()}`) {
      return
    }

    const rootListEl = el.closest('[role="tree"]')
    const parentEl = el.parentElement

    if (!rootListEl || !parentEl) return

    const siblingEls = Array.from(
      parentEl.querySelectorAll(
        this.listItemSelectors.map((s) => `:scope > ${s}`).join(','),
      ),
    )

    const listItems = Array.from(rootListEl.querySelectorAll('li'))

    const availableListItems = Array.from(
      rootListEl.querySelectorAll(
        this.listItemSelectors
          .flatMap((s) => [
            `:scope > ${s}`,
            `${s}[aria-expanded="true"] > ul > li`,
          ])
          .join(','),
      ),
    ) as HTMLElement[]

    const elIndex = availableListItems.indexOf(el)

    const prevEl = elIndex === 0 ? null : availableListItems[elIndex - 1]
    const nextEl =
      elIndex === availableListItems.length - 1
        ? null
        : availableListItems[elIndex + 1]

    const parentListItem =
      el.parentElement.getAttribute('role') === 'group'
        ? el.parentElement.closest('li')
        : null

    switch (e.key) {
      case 'Enter':
        for (const item of listItems) {
          if (item.getAttribute('aria-selected') !== 'true' || item === el) {
            continue
          }

          item.setAttribute('aria-selected', 'false')
        }

        el.setAttribute('aria-selected', 'true')

        break

      case ' ':
        for (const item of listItems) {
          if (item.getAttribute('aria-selected') !== 'true' || item === el) {
            continue
          }

          item.setAttribute('aria-selected', 'false')
        }
        el.setAttribute('aria-selected', 'true')
        break

      case 'ArrowUp':
        prevEl?.focus()
        break

      case 'ArrowDown':
        nextEl?.focus()
        break

      case 'ArrowLeft':
        if (el.getAttribute('aria-expanded') === 'true') {
          el.querySelector(':scope > ul')?.setAttribute('hidden', '')
          el.setAttribute('aria-expanded', 'false')
        } else if (parentListItem) {
          parentListItem.focus()
        }
        break

      case 'ArrowRight':
        if (el.getAttribute('aria-expanded') === 'false') {
          el.querySelector(':scope > ul')?.removeAttribute('hidden')
          el.setAttribute('aria-expanded', 'true')
        } else {
          (el.querySelector(':scope > ul > li') as HTMLElement)?.focus()
        }
        break

      case 'Home':
        availableListItems[0].focus()
        break

      case 'End':
        availableListItems[availableListItems.length - 1].focus()
        break

      case '*':
        for (const sibling of siblingEls) {
          if (sibling.getAttribute('aria-expanded') !== 'false') continue

          sibling.setAttribute('aria-expanded', 'true')
          sibling.querySelector(':scope > ul')?.removeAttribute('hidden')
        }
        break

      default:
        for (let i = 0; i < availableListItems.length; i++) {
          if (i < elIndex) continue

          const item = availableListItems[i]

          if (item.innerText?.toLowerCase().startsWith(e.key.toLowerCase())) {
            item.focus()
            break
          }

          if (i === availableListItems.length - 1) {
            availableListItems[0].focus()
          }
        }
        break
    }
  }

  handleFocus = (e: FocusEvent) => {
    const el = e.target as HTMLElement

    if (!el) return

    const rootListEl = el.closest('[role="tree"]')

    if (!rootListEl) return

    const listItems = Array.from(rootListEl.querySelectorAll('li')) as HTMLElement[]

    for (const item of listItems) {
      if (item === el || item.getAttribute('tabindex') === '-1') continue

      item.setAttribute('tabindex', '-1')
    }

    el.setAttribute('tabindex', '0')
  }

  headingSelectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    '[role="heading"]',
  ]

  listSelectors = ['ul', 'ol', '[role="list"]']

  listItemSelectors = ['li', '[role="listitem"]']

  get headingEls(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll(
        this.headingSelectors.join(','),
      ),
    )
  }

  get listEl(): HTMLElement | null {
    return this.querySelector(
      this.listSelectors.map((s) => `:scope > ${s}`).join(','),
    )
  }
}

LbdTreeview.register()

export { LbdTreeview }
