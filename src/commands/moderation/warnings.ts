/**
 * ================================================================
 * Name: Warnings Command
 * Description: Displays or clears stored warnings for a member.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Give moderators visibility into a member's warning history.
 * Usage: `/warnings user:<user> [clear:<boolean>]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { clearWarningsForUser, getWarningsForUser } from '../../storage/warnings.js';

const warnings: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('View or clear warnings for a member.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to view warnings for').setRequired(true),
		)
		.addBooleanOption(option =>
			option
				.setName('clear')
				.setDescription('Set to true to clear all warnings for the member')
				.setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const target = interaction.options.getUser('user', true);
		const shouldClear = interaction.options.getBoolean('clear') ?? false;

		if (shouldClear) {
			// Mods want immediate feedback when nuking a history.
			const removed = await clearWarningsForUser(target.id);
			await interaction.reply({
				content: `Cleared ${removed} warning(s) for ${target.tag}.`,
				ephemeral: true,
			});
			return;
		}

		const records = await getWarningsForUser(target.id);

		if (records.length === 0) {
			// Quiet acknowledgement keeps things optimistic.
			await interaction.reply({
				content: `${target.tag} has no warnings on record.`,
				ephemeral: true,
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`Warnings for ${target.tag}`)
			.setColor(0xff8c94)
			// Dense list, but we want every warn visible without pagination yet.
			.setDescription(
				records
					.map(
						record =>
							`• **${new Date(record.createdAt).toLocaleString()}** — ${record.reason} *(by <@${record.moderatorId}>)*`,
					)
					.join('\n'),
			)
			.setFooter({ text: `Total warnings: ${records.length}` });

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

export default warnings;
