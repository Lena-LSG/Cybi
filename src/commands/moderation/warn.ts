/**
 * ================================================================
 * Name: Warn Command
 * Description: Issues a formal warning to a user and stores it persistently.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide moderators with a lightweight enforcement action.
 * Usage: `/warn user:<user> reason:<text>`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { addWarning } from '../../storage/warnings.js';

const warn: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Issue a formal warning to a server member.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to warn').setRequired(true),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are they being warned?').setRequired(true),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const target = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason', true);

		if (target.bot) {
			await interaction.reply({
				content: 'You cannot warn bots.',
				ephemeral: true,
			});
			return;
		}

		if (target.id === interaction.user.id) {
			// Mod self-warns sound funny but they're usually mistakes.
			await interaction.reply({
				content: 'You cannot warn yourself.',
				ephemeral: true,
			});
			return;
		}

		// Persist to SQLite so we can pull the paper trail later.
		const record = await addWarning(target.id, interaction.user.id, reason, interaction.id);
		const embed = new EmbedBuilder()
			.setTitle('Warning issued')
			.setDescription(`Warned **${target.tag}**`)
			.addFields(
				{ name: 'Moderator', value: interaction.user.tag, inline: true },
				{ name: 'Reason', value: reason, inline: false },
				{ name: 'Record ID', value: record.id, inline: true },
			)
			.setTimestamp(new Date(record.createdAt))
			.setColor(0xffb347);

		await interaction.reply({
			embeds: [embed],
		});
	},
};

export default warn;
