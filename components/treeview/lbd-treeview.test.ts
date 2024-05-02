import { LbdTreeview } from './lbd-treeview'

LbdTreeview.register()

describe('lbd-treeview', () => {
  document.body.innerHTML = `
    <lbd-treeview>
      <ul>
        <li>Apple</li>
        <li>
          Banana
          <ul>
            <li>Cucumber</li>
          </ul>
        </li>
        <li>Dragonfruit</li>
        <li>
          Eggplant
          <ul>
            <li>Fennel</li>
          </ul>
        </li>
      </ul>
    </lbd-treeview>
  `

  it('should have correct role', () => {
    expect(document.querySelector('[role="tree"]')).toBeDefined()
  })

  it('should have list items with attributes', () => {
    const listItem = document.querySelector('li[role="treeitem"]')

    expect(listItem).toBeDefined()

    expect(listItem.hasAttribute('aria-level')).toBeTruthy()
    expect(listItem.hasAttribute('aria-setsize')).toBeTruthy()
    expect(listItem.hasAttribute('aria-posinset')).toBeTruthy()
    expect(listItem.hasAttribute('aria-selected')).toBeTruthy()
    expect(listItem.hasAttribute('tabindex')).toBeTruthy()
  })

  it('should have correct role on nested list', () => {
    expect(document.querySelector('ul ul')?.getAttribute('role')).toBe('group')
  })
})
