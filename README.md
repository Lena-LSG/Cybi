# Cybi
Personal Discord bot built by **Lena Gibson** to keep small community servers healthy, welcoming, and organized. The project doubles as a playground for modern Discord bot patterns (TypeScript + Discord.js 14, strong tooling) and a practical moderation suite I can run locally or open source.

## Vision
- **Moderation first** – Warn/mute/kick/ban flows, message cleanup, channel lockdown controls, and warning persistence sized for sub-25 member servers.
- **Friendly utilities** – Reminders, quote boards, dice rolls, schedules, Google-powered lookups—tools community members actually use.
- **Simple hosting** – Runs locally today, ready for PM2/container deployment tomorrow without rewrites.

## Tech Stack
- Node.js 20+, TypeScript, Discord.js 14
- tsx (dev runtime), tsup (bundles), ESLint + Prettier, Vitest
- dotenv + Zod for configuration validation
- Pino logging (human-readable in dev, JSON in prod)

## Quick Start
```bash
git clone <repo-url>
cd cybi
npm install
cp .env.example .env    # fill in token + IDs
npm run dev             # run locally with hot reload
npm run deploy:guild    # publish slash commands to your dev guild
```

### Environment
| Variable | Description |
| --- | --- |
| `DISCORD_TOKEN` | Bot token from the Discord Developer Portal (Bot tab). |
| `DISCORD_CLIENT_ID` | Application ID. |
| `DISCORD_GUILD_ID` | Dev guild for slash-command testing (optional for global deploy). |
| `MODERATOR_ROLE_IDS` | Comma-separated role IDs treated as moderators (optional, falls back to Discord permissions). |
| `WARNING_RETENTION_DAYS` | Days to keep warning records before automatic cleanup (default 180). |
| `GOOGLE_API_KEY` / `GOOGLE_CSE_ID` | Optional. Enable `/google` search via Google Custom Search API. |
| `NODE_ENV` | `development` / `production`. |

## Scripts
- `npm run dev` – run via tsx with env injection + hot reload.
- `npm run build` – bundle to `dist/` (ESM) with tsup.
- `npm run start` – execute bundled bot (`node --env-file=.env dist/bot.js`).
- `npm run deploy:guild` / `deploy:global` – refresh slash commands (guild instant, global cached).
- `npm run lint`, `lint:fix`, `format`, `format:fix`, `test`, `test:watch`.

## Command Catalog

### Core
| Command | Description |
| --- | --- |
| `/ping` | Round-trip latency check for quick sanity testing. |
| `/avatar [user]` | Displays the avatar of yourself or another member (1024px embed). |
| `/serverinfo` | Shows owner, member count, boost tier, creation date, and guild ID. |
| `/help` | Ephemeral overview grouped by category. |

### Moderation
| Command | Description |
| --- | --- |
| `/warn user reason` | Issues a persisted warning (SQLite-backed) with moderator attribution. |
| `/warnings user [clear]` | Lists warnings or clears them entirely. |
| `/mute user duration [reason]` | Applies Discord timeouts (up to 28 days). |
| `/unmute user [reason]` | Clears active timeouts. |
| `/kick user [reason]` | Removes a member immediately. |
| `/ban user [delete_days] [reason]` | Bans and optionally purges up to 7 days of messages. |
| `/unban user_id [reason]` | Lifts a ban via raw user ID. |
| `/purge amount` | Bulk deletes up to 100 recent messages (skips older than 14 days). |
| `/slowmode duration [channel] [reason]` | Sets or disables slowmode per channel. |
| `/lock [channel] [enabled] [reason]` | Toggles send/thread permissions for @everyone. |

### Utility
| Command | Description |
| --- | --- |
| `/google query [results]` | Google Custom Search integration (requires API key + CSE ID). |

### Data Storage
- Moderation data persists in a local SQLite file inside the repo's `data/` directory (gitignored by default).
- `WARNING_RETENTION_DAYS` controls automatic cleanup of stale warnings before inserts/queries; rotate or relocate the DB file to suit your deployment model.

## Roadmap
1. **Core actions** – `/ping`, `/avatar`, `/serverinfo`, `/help`.
2. **Moderation suite** – warn/mute/kick/ban/purge/slowmode/lock with persistence + logging.
3. **Utility pack** – reminders, quotes, dice, schedules, Google search helper.
4. **Events & automation** – welcome/goodbye, channel logging, scheduled job service.
5. **Hosting polish** – container image, PM2 profile, monitoring hooks, and final naming/branding.

Questions, suggestions, or running your own copy? Open an issue or fork the repo. I'd love to hear what you build!

## Contributing & Support
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow and expectations.
- All participants must follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
- Report vulnerabilities privately via [SECURITY.md](./SECURITY.md)—please don’t open public issues for security concerns.
