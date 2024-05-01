# `lbd-treeview`

A Web Component for creating an accessible tree views

**[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)**

## Examples

General usage example:

```html
<script type="module" src="lbd-treeview.js"></script>

<lbd-treeview label="Fruits and Veggies">
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
```

## Features

This Web Component allows you to:

1.

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@lunchbreakdev/lbd-treeview): `npm install @lunchbreakdev/lbd-treeview`
2. [Download the source manually from GitHub](https://github.com/lunchbreakdev/lbd-components/releases) into your project.
3. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)
