/**
 * ================================================================
 * Name: Unmute Command
 * Description: Removes an active timeout from a muted member.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Restore speaking privileges after a timeout concludes early.
 * Usage: `/unmute user:<member> [reason]`
 * ================================================================
 */
import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { validateTargetMember } from '../../lib/moderation.js';

const unmute: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Remove the timeout from a member.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to unmute').setRequired(true),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are they being unmuted?').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const validation = await validateTargetMember(interaction, 'user', 'unmute');
		if (!validation) {
			return;
		}

		if (!validation.member.communicationDisabledUntilTimestamp) {
			// Timeout already expired; nothing to do but let the mod know.
			await interaction.reply({
				content: `${validation.member.user.tag} is not currently muted.`,
				ephemeral: true,
			});
			return;
		}

		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		await validation.member.timeout(null, reason);

		await interaction.reply({
			content: `Unmuted ${validation.member.user.tag}.`,
			ephemeral: true,
		});
	},
};

export default unmute;
