/**
 * ================================================================
 * Name: Purge Command
 * Description: Bulk deletes a number of recent messages in the current channel.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Clean up spam or backscroll quickly.
 * Usage: `/purge amount:<1-100>`
 * ================================================================
 */
import { SlashCommandBuilder, type GuildTextBasedChannel } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';

const purge: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Delete a batch of recent messages from the current channel.')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Number of messages to delete (max 100)')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		if (!interaction.channel || interaction.channel.isDMBased() || !interaction.channel.isTextBased()) {
			await interaction.reply({
				content: 'This command can only be used inside a text channel.',
				ephemeral: true,
			});
			return;
		}

		// Type assertion is safe thanks to the guard above.
		const channel = interaction.channel as GuildTextBasedChannel;
		const amount = interaction.options.getInteger('amount', true);

		// bulkDelete auto-skips messages older than 14 days when `true`.
		const deleted = await channel.bulkDelete(amount, true);

		await interaction.reply({
			content: `Deleted ${deleted.size} message(s).`,
			ephemeral: true,
		});
	},
};

export default purge;
