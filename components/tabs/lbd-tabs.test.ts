import { LbdTabs } from './lbd-tabs'

LbdTabs.register()

describe('lbd-tabs', () => {
  document.body.innerHTML = `
    <lbd-tabs>
      <ol>
        <li>
          <a href="#tab-1">Tab 1</a>
        </li>
        <li>
          <a href="#tab-2">Tab 2</a>
        </li>
        <li>
          <a href="#tab-3">Tab 3</a>
        </li>
      </ol>

      <div id="tab-1">
        Content 1
      </div>
      <div id="tab-2">
        Content 2
      </div>
      <div id="tab-3">
        Content 3
      </div>
    </lbd-tabs>
  `

  it('should have a tablist role', () => {
    expect(document.querySelector('ol[role="tablist"]')).toBeTruthy()
  })

  it('should have three tabs', () => {
    expect(
      Array.from(document.querySelectorAll('a[role="tab"]')).length,
    ).toEqual(3)
  })

  it('should have one selected tab', () => {
    expect(
      Array.from(document.querySelectorAll('a[aria-selected="true"]')).length,
    ).toEqual(1)
  })

  it('should have three panels', () => {
    expect(
      Array.from(document.querySelectorAll('[role="tabpanel"]')).length,
    ).toEqual(3)
  })

  it('should have one selected panel', () => {
    expect(
      Array.from(document.querySelectorAll('[role="tabpanel"]:not([hidden])'))
        .length,
    ).toEqual(1)
  })
})
