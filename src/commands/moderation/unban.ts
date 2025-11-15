/**
 * ================================================================
 * Name: Unban Command
 * Description: Removes a ban using a user ID.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Restore access when an appeal succeeds or ban was erroneous.
 * Usage: `/unban user_id:<snowflake> [reason]`
 * ================================================================
 */
import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import logger from '../../lib/logger.js';

const unban: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Lift a ban using the user ID.')
		.addStringOption(option =>
			option
				.setName('user_id')
				.setDescription('ID of the user to unban')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Reason for lifting the ban').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		if (!interaction.guild) {
			await interaction.reply({
				content: 'This command can only be used inside a server.',
				ephemeral: true,
			});
			return;
		}

		const userId = interaction.options.getString('user_id', true);
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';

		try {
			await interaction.guild.bans.remove(userId, reason);
			await interaction.reply({
				content: `Unbanned user ID ${userId}.`,
			});
		} catch (error) {
			// Intentionally vague in Discord response, but log everything server-side.
			logger.error({ err: error, userId }, 'Failed to unban user');
			await interaction.reply({
				content: `Failed to unban user ID ${userId}. They may not be banned.`,
				ephemeral: true,
			});
		}
	},
};

export default unban;
