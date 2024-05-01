import { Lbd{%Template%} } from './lbd-{%template%}'

Lbd{%Template%}.register()

describe('lbd-{%template%}', () => {
  document.body.innerHTML = `
    <lbd-{%template%}>

    </lbd-{%template%}>
  `
})
