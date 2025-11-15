/**
 * ================================================================
 * Name: Help Command
 * Description: Provides a quick reference of available core commands.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Offer users discoverability for the bot's functionality.
 * Usage: `/help`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';

const help: BotCommand = {
	data: new SlashCommandBuilder().setName('help').setDescription('List available commands.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Available Commands')
			// Group by category so the list scales without turning into soup.
			.addFields(
				{
					name: 'Core',
					value: ['`/ping`', '`/avatar [user]`', '`/serverinfo`'].join('\n'),
				},
				{
					name: 'Moderation',
					value: [
						'`/warn user reason`',
						'`/warnings user [clear]`',
						'`/mute user duration [reason]`',
						'`/unmute user [reason]`',
						'`/kick user [reason]`',
						'`/ban user [delete_days] [reason]`',
						'`/unban user_id [reason]`',
						'`/purge amount`',
						'`/slowmode duration [channel] [reason]`',
						'`/lock [channel] [enabled] [reason]`',
					].join('\n'),
				},
				{
					name: 'Utility',
					value: ['`/google query [results]`'].join('\n'),
				},
			)
			.setColor(0xbfa5ff)
			.setFooter({ text: 'More categories coming soon.' });

		// Keep this ephemeral; no one likes spammy help output in-channel.
		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

export default help;
