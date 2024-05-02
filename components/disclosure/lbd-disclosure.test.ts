import { LbdDisclosure } from './lbd-disclosure'

LbdDisclosure.register()

describe('lbd-disclosure', () => {
  document.body.innerHTML = `
    <lbd-disclosure>
      <details>
        <summary>More Information</summary>
        Disclosure content goes here...
      </details>
    </lbd-disclosure>
  `

  const detailsId = document.querySelector('details')?.getAttribute('id')
  const summaryId = document.querySelector('summary')?.getAttribute('id')

  it('should have a details element with an id attribute', () => {
    expect(detailsId).toBeTruthy()
  })

  it('should have a details element with an aria-labelledby attribute', () => {
    expect(
      document.querySelector('details')?.getAttribute('aria-labelledby'),
    ).toBe(summaryId)
  })

  it('should have a summary element with an id attribute', () => {
    expect(summaryId).toBeTruthy()
  })

  it('should have a summary element with an aria-controls attribute', () => {
    expect(
      document.querySelector('summary')?.getAttribute('aria-controls'),
    ).toBe(detailsId)
  })

  it('should have a summary element with an aria-expanded attribute', () => {
    expect(
      document.querySelector('summary')?.getAttribute('aria-expanded'),
    ).toBe('false')
  })
})
