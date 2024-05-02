import { LbdTooltip } from './lbd-tooltip'

LbdTooltip.register()

describe('lbd-tooltip', () => {
  document.body.innerHTML = `
    <lbd-tooltip>
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
        alt="Tom Cook profile picture"
        title="Tom Cook"
      />
    </lbd-tooltip>
  `

  it('should not have a title attribute', () => {
    expect(document.querySelector('[title]')).toBeNull()
  })

  it('should have an aria-describedby attribute', () => {
    expect(document.querySelector('img[aria-describedby]')).toBeDefined()
  })

  it('should have a shadow root', () => {
    expect(document.querySelector('lbd-tooltip').shadowRoot).toBeDefined()
  })

  it('should have a tooltip element', () => {
    expect(
      document
        .querySelector('lbd-tooltip')
        .shadowRoot.querySelector('[role="tooltip"]'),
    ).toBeDefined()
  })
})
