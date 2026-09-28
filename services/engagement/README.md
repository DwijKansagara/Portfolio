# Engagement service

This small Express and PostgreSQL service powers the real visitor totals and 20-step appreciation control used across Dwij Kansagara's public projects.

- Counts are stored per site.
- Each visitor can add at most 20 appreciation presses per site.
- The browser receives an immediate visual response while presses sync in the background.
- No cookie or browser identifier is created.
- Request IP and user-agent values are converted immediately into a salted one-way HMAC; the source values are not stored.
- Global Privacy Control and Do Not Track prevent passive visit insertion.

The production service is deployed separately at `https://dwij-counts.antideploy.com`. It reads `DATABASE_URL` at runtime and creates its own tables on startup.
