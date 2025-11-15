/**
 * ================================================================
 * Name: Command Registry
 * Description: Centralizes command imports and exposes helper factories.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide a single source of truth for available slash commands.
 * Usage: Import `commands` for deployment or `buildCommandMap` for runtime lookup.
 * ================================================================
 */
import { Collection } from 'discord.js';
import ping from './core/ping.js';
import avatar from './core/avatar.js';
import serverInfo from './core/serverinfo.js';
import help from './core/help.js';
import warn from './moderation/warn.js';
import warnings from './moderation/warnings.js';
import mute from './moderation/mute.js';
import unmute from './moderation/unmute.js';
import kick from './moderation/kick.js';
import ban from './moderation/ban.js';
import unban from './moderation/unban.js';
import purge from './moderation/purge.js';
import slowmode from './moderation/slowmode.js';
import lock from './moderation/lock.js';
import googleCommand from './utility/google.js';
import type { BotCommand } from '../types/command.js';

// Manual list keeps ordering intentional; categories stay obvious in reviews.
const registry: BotCommand[] = [
	ping,
	avatar,
	serverInfo,
	help,
	warn,
	warnings,
	mute,
	unmute,
	kick,
	ban,
	unban,
	purge,
	slowmode,
	lock,
	googleCommand,
];

export const commands = registry;

export const buildCommandMap = () => {
	const map = new Collection<string, BotCommand>();
	for (const command of registry) {
		// Keys should match slash names exactly so Discord lookups stay trivial.
		map.set(command.data.name, command);
	}
	return map;
};
