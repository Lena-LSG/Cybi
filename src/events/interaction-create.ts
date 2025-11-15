/**
 * ================================================================
 * Name: Interaction Handler
 * Description: Routes chat input commands to their corresponding executors.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Central hub for handling Discord interaction events safely.
 * Usage: Register via `registerEvents` to wire commands at runtime.
 * ================================================================
 */
import { Events, type Client, type Collection } from 'discord.js';
import type { BotCommand } from '../types/command.js';
import logger from '../lib/logger.js';

export const registerInteractionHandler = (
	client: Client,
	commandMap: Collection<string, BotCommand>,
) => {
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) {
			// Ignore pings/buttons/etc for now—future categories can hook here.
			return;
		}

		const command = commandMap.get(interaction.commandName);

		if (!command) {
			logger.warn({ commandName: interaction.commandName }, 'Received unknown command');
			if (interaction.isRepliable()) {
				// Better to give users a polite shrug than silence when commands desync.
				await interaction.reply({
					content: 'This command is not available right now.',
					ephemeral: true,
				});
			}
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(
				{ err: error, commandName: command.data.name, userId: interaction.user.id },
				'Command execution failed',
			);

			// Discord punishes commands that error silently—always send a reply.
			if (interaction.deferred || interaction.replied) {
				await interaction.followUp({
					content: 'There was an error while executing this command.',
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command.',
					ephemeral: true,
				});
			}
		}
	});
};
