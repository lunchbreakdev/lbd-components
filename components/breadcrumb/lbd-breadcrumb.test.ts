import { LbdBreadcrumb } from './lbd-breadcrumb'

LbdBreadcrumb.register()

describe('lbd-breadcrumb', () => {
  document.body.innerHTML = `
    <lbd-breadcrumb>
      <ol>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Account</a>
        </li>
      </ol>
    </lbd-breadcrumb>
  `

  it('should have a role attribute', () => {
    expect(
      document.querySelector('lbd-breadcrumb[role="navigation"]'),
    ).toBeDefined()
  })

  it('should have a label attribute', () => {
    expect(
      document.querySelector('lbd-breadcrumb').getAttribute('aria-label'),
    ).toBe('Breadcrumb')
  })

  it('should have a link with an aria-current attribute', () => {
    expect(document.querySelector('a[aria-current="page"]')).toBeDefined()
  })
})
