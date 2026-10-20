# Security Policy

## Reporting a vulnerability

Email **security@<domain>** with what you found, how to reproduce it, and the
impact you believe it has. Please do not open a public issue, and please give
us a reasonable window (30 days) before disclosing publicly.

## Scope

In scope: the extension, the Yotajob API, and the Yotajob web app.

Out of scope: findings that require a malicious user with legitimate access, and
automated denial of service.

## What this extension will never do

- Submit a form on your behalf.
- Read a page you have not asked it to read.
- Hold a secret. The extension is a public client; if you find a secret in
  this code, that is a bug worth reporting.
