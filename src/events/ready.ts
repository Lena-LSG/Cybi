/**
 * ================================================================
 * Name: Ready Event
 * Description: Logs bot identity once the Discord gateway signals readiness.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide a single place to handle ClientReady side effects.
 * Usage: Called from `registerEvents` with the active Discord client.
 * ================================================================
 */
import { Events, type Client } from 'discord.js';
import logger from '../lib/logger.js';

export const registerReadyEvent = (client: Client) => {
	client.once(Events.ClientReady, readyClient => {
		// I like having the bot introduce itself when it dials in—instant sanity check.
		logger.info(
			{ tag: readyClient.user.tag, id: readyClient.user.id },
			'Bot connected to Discord',
		);
	});
};
