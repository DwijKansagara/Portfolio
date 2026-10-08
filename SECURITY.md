# Security

Report a suspected vulnerability privately to **work.dwijkansagara@gmail.com**. Do not include secrets or personal data in a public issue.

## Current design

The portfolio has no accounts, passwords, JWTs, uploads, payments, webhooks, or user-controlled server fetches. Its shared engagement API accepts only fixed site identifiers, uses parameterized PostgreSQL queries, exact production CORS origins, same-site request-intent checks, durable rate limiting with salted network hashes, bounded JSON, restrictive security headers, redacted logs, and server-held database credentials. Tables have public privileges revoked and row-level security enabled; browsers never connect to the database.

The browser stores only a random site-specific appreciation identifier. It does not store authentication tokens. User-facing text is rendered through React or text-only DOM APIs rather than untrusted HTML.

## Required future gates

Before adding authentication, uploads, webhooks, outbound URL fetching, or client-accessible database APIs, implement the matching controls in the workspace `AGENTS.md`: server-side object authorization, secure sessions and MFA, validated isolated uploads, raw-body webhook signatures, SSRF allowlists, and explicit RLS policies. Production source maps and default credentials are forbidden.

Run `npm audit`, `npm run lint`, `npm test`, and `npm run build` before release. Provider accounts should have MFA enabled by their owner.
