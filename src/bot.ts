/**
 * ================================================================
 * Name: Bot Bootstrap
 * Description: Initializes the Discord client, loads commands/events, and logs the bot in.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Central entry point for the application runtime.
 * Usage: Invoked via `npm run dev` for development or `npm run start` after building.
 * ================================================================
 */
import { Client, GatewayIntentBits } from 'discord.js';
import { env } from './config/env.js';
import logger from './lib/logger.js';
import { buildCommandMap } from './commands/index.js';
import { registerEvents } from './events/index.js';

const client = new Client({
	// Keeping intents lean until we truly need message content or members.
	intents: [GatewayIntentBits.Guilds],
});

const main = async () => {
	const commandMap = buildCommandMap();
	// Event registration stays centralized so we can hot-swap categories later.
	registerEvents(client, commandMap);

	// Everything funnels through env tokens; keep secrets in the .env file, please.
	await client.login(env.token);
};

main().catch(error => {
	logger.error({ err: error }, 'Failed to start bot');
	process.exitCode = 1;
});
