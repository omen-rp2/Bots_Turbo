# OMEN portal inside Bots_Turbo

The OMEN website now uses this existing Railway service at:
`https://botsturbo-production.up.railway.app/omen`

The integration reuses the running Discord client, DISCORD_BOT_TOKEN, DISCORD_CLIENT_SECRET, SESSION_SECRET and the existing PostgreSQL/file persistence. No second bot process or new OAuth callback is needed. Keep the currently registered callback:
`https://botsturbo-production.up.railway.app/auth/discord/callback`

OMEN sign-in starts at `/omen/auth/discord`. A state-bound HttpOnly cookie selects the OMEN callback flow; the existing login flow is retained. The user must be a member of OMEN guild 1561064547853402234 before receiving a website session. SESSION_SECRET must contain at least 32 characters.

## Required Discord access
The existing bot/application must be invited to the OMEN guild. It needs Server Members Intent enabled, Manage Roles, and View Channel / Send Messages / Embed Links / Attach Files in the two channels below. Its highest role must be above the three managed roles. Administrator is not required.

| Purpose | Discord ID |
|---|---|
| Guild | 1561064547853402234 |
| Welcome channel | 1561064550303015088 |
| Application review channel | 1561064552764936308 |
| Member role | 1561064547895222275 |
| Pending role | 1561064547895222277 |
| Accepted role | 1561064547895222278 |
| Website owner | 1445069224899907709 |

As explicitly requested, any member who can view the review channel can accept/reject using its buttons. Rejection requires a reason. The first saved decision wins, its reviewer is recorded, and the buttons are removed. The owner and optional OMEN_REVIEWER_IDS may also review from the website. This module does not change Discord channel permissions.

## Persistence and notifications
All OMEN records are namespaced under `omenPortal` inside the existing database; previous applications, stores, creators and other bot state are preserved. Applications, role updates and Discord delivery jobs survive normal application restarts when the existing DATABASE_URL or persistent DATA_FILE is configured. Ephemeral Railway files alone are not durable across deployments.

On joining the guild or first website sign-in, the member receives the member role and a welcome. Submission grants the pending role and posts a review summary, full-answer text attachment and buttons. Acceptance grants the accepted role and removes pending; rejection removes pending and accepted. A DM is attempted and the decision/rejection reason is always available to the applicant on the website. Closed DMs are recorded as blocked and can be retried by the owner. Network/permission failures retry with backoff. A message may be duplicated after an ambiguous network failure.

## Public verification
`GET /omen/api/config` returns integration version, botInGuild, oauthReady and applicationsReady booleans without exposing credentials. `GET /omen/api/me` returns only the current account's application; unauthenticated callers see null. The integration does not submit fake applications or send unsolicited test messages.

The GitHub Pages website sets apiBase to the public `/omen` URL in both portal-config.js files, accepts the signed `omen_token` login response and retains that API prefix.

## Optional variables
- OMEN_REVIEWER_IDS: comma-separated website reviewer Discord IDs.
- OMEN_BRIDGE_SECRET: random 64-character secret for the existing FiveM queue resource (falls back to BRIDGE_SECRET if set). Put the same secret in the resource's server.cfg convar. Set resource Config.Api to `https://botsturbo-production.up.railway.app/omen`. Queue linking and bridge endpoints are disabled until a strong bridge secret is set.

## Checks
`node --check index.js`
`node --check omen-portal.js`
`node --test tests/omen-portal.test.mjs`

Tests use isolated in-memory data and mock Discord. Live OAuth, channel delivery and role hierarchy require the configured real bot and a user-approved real application. No live member application is created by tests.

## Replacing the Discord application
Set DISCORD_CLIENT_ID=1565316709253128294. DISCORD_CLIENT_SECRET must be from that same application; DISCORD_BOT_TOKEN must be its freshly reset bot token. The public OAuth callback remains unchanged and must be added in the new application. Never commit either secret. OAuth readiness now also requires the connected bot application ID to match the configured client ID.
