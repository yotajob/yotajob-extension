# Yotajob extension

The Chrome extension for Yotajob: save a job posting to your private ledger, and
fill application fields only after you review them.

This repository is **public source with no open-source license**. Copyright © 2026
Yotajob. All rights reserved. The Yotajob application itself is closed source.

## What it does

- Detects a job posting on the page you are looking at (JSON-LD `JobPosting`
  first, then sensible fallbacks).
- Saves it to your tracker at stage **Saved**.
- Fills application fields only after you review every field. It never submits.

## What it deliberately does not do

- No background browsing: it reads a page only when you click the extension.
- No site-wide permissions beyond `activeTab` and the API host.
- No secrets. The extension is a public client and authenticates with the
  device-code + PKCE flow, so there is nothing to extract from it.
- No tracking of your browsing history. The only page data that leaves your
  browser is what you explicitly save.

## Build

```sh
pnpm install
pnpm build      # -> dist/
pnpm zip        # -> a zip for the Chrome Web Store
```

Load `dist/` through `chrome://extensions` → *Load unpacked* during development.

## Security

Please report vulnerabilities to **security@<domain>** rather than opening a
public issue. See [SECURITY.md](SECURITY.md).
