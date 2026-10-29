# OMEN Discord tickets

- Guild: `1561064547853402234`
- Entry panel: `1561064551733272594`
- Ticket category: `1561064551733272592`
- Ticket staff role: `1561064547966521476`

On startup, the bot installs or updates its own ticket panel and the guild slash command `/ticket`. Existing commands are preserved. Setup retries every minute when permissions or configuration are unavailable. `GET /omen/api/tickets/status` reports setup health without private ticket information.

Members choose technical support, oversight, ban appeal, player complaint, or content creator application. A tailored modal collects answers before creating a private text channel. One open ticket per member and a one minute cooldown prevent duplicate creation. Questions and answers remain on the opening message. The first ticket triggers a branded private welcome when DMs are available.

Staff run `/ticket` inside the ticket for an ephemeral management menu. Shared ticket messages contain no staff buttons. Every action and modal submission checks the current exact staff role. Staff can claim, transfer to another member of that role, rename, change category type, or close with a required reason. Closing removes the opener's channel access and retains the channel as an archive. The bot sends the closure reason privately and reports if Discord refuses the DM. No automatic deletion is performed; staff should move old archives when the category approaches Discord's 50-channel limit.

The bot needs View Channel, Send Messages, Embed Links and Read Message History in the entry panel, plus Manage Channels and Manage Permissions in the ticket category. Allow the staff role to Use Application Commands. Tickets use explicit overwrites for the opener, staff role and bot, with @everyone denied View Channel. Discord server Administrators inherently retain access.

Local/SQL state records answers, closure reasons and audit entries. Channel topics also carry owner, number, type, assignee and closed/open state so existing tickets and first-use deduplication survive local state loss. Original question messages remain in Discord. Persistent storage is still recommended for the full audit and notification status.

Validation: `node --test tests/omen-tickets.test.mjs tests/omen-portal.test.mjs`
