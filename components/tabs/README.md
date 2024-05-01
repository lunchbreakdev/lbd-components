# `lbd-tabs`

A Web Component for creating accessible tabs

**[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)**

## Examples

General usage example:

```html
<script type="module" src="lbd-tabs.js"></script>

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
```

## Features

This Web Component allows you to:

1.

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@lunchbreakdev/lbd-tabs): `npm install @lunchbreakdev/lbd-tabs`
2. [Download the source manually from GitHub](https://github.com/lunchbreakdev/lbd-components/releases) into your project.
3. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)
