/**
 * ================================================================
 * Name: Command Deployment Script
 * Description: Refreshes guild or global slash commands through the Discord REST API.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide an automated way to sync command definitions from the codebase.
 * Usage: `npm run deploy:guild` or `npm run deploy:global`
 * ================================================================
 */
import { REST, Routes } from 'discord.js';
import { commands } from '../commands/index.js';
import logger from '../lib/logger.js';
import { env } from '../config/env.js';

type DeployScope = 'guild' | 'global';

const getScope = (): DeployScope => {
	const eqFlag = process.argv.find(arg => arg.startsWith('--scope='));
	if (eqFlag) {
		const [, value] = eqFlag.split('=');
		if (value === 'guild' || value === 'global') {
			return value;
		}
		throw new Error(`Unsupported scope "${value}". Use "guild" or "global".`);
	}

	const idx = process.argv.indexOf('--scope');
	if (idx >= 0) {
		const value = process.argv[idx + 1];
		if (value === 'guild' || value === 'global') {
			return value;
		}
		throw new Error(`Unsupported or missing scope value after --scope`);
	}

	// Default to guild deploy so we don't accidentally spam global updates.
	return 'guild';
};

const main = async () => {
	const scope = getScope();
	const rest = new REST({ version: '10' }).setToken(env.token);
	// Convert SlashCommandBuilder data to JSON payload Discord expects.
	const body = commands.map(command => command.data.toJSON());

	logger.info({ scope, count: body.length }, 'Refreshing application commands');

	if (scope === 'global') {
		// Global pushes take up to an hour to propagate—use sparingly.
		await rest.put(Routes.applicationCommands(env.clientId), { body });
		logger.info('Successfully reloaded global commands.');
		return;
	}

	if (!env.guildId) {
		throw new Error('DISCORD_GUILD_ID must be set to refresh guild commands.');
	}

	// Guild deploys are instant, perfect for development iteration.
	await rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), { body });
	logger.info('Successfully reloaded guild commands.');
};

main().catch(error => {
	logger.error({ err: error }, 'Failed to deploy application commands');
	process.exitCode = 1;
});
