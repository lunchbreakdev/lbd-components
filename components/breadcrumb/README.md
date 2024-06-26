# `lbd-breadcrumb`

A Web Component for creating accessible breadcrumbs

**[WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)**

## Examples

General usage example:

```html
<script type="module" src="lbd-breadcrumb.js"></script>

<lbd-breadcrumb>
  <ol>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/profile">Profile</a>
    </li>
    <li>
      <a href="/profile/settings">Settings</a>
    </li>
    <li>
      <a href="profile/settings/account">Account</a>
    </li>
  </ol>
</lbd-breadcrumb>
```

## Features

This Web Component allows you to:

1.

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@lunchbreakdev/lbd-breadcrumb): `npm install @lunchbreakdev/lbd-breadcrumb`
2. [Download the source manually from GitHub](https://github.com/lunchbreakdev/lbd-components/releases) into your project.
3. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)
