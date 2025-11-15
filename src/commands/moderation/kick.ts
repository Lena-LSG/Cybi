/**
 * ================================================================
 * Name: Kick Command
 * Description: Removes a member from the guild.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide moderators a quick eviction tool for rule breakers.
 * Usage: `/kick user:<member> [reason]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { validateTargetMember } from '../../lib/moderation.js';

const kick: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to kick').setRequired(true),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are they being kicked?').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const validation = await validateTargetMember(interaction, 'user', 'kick');
		if (!validation) {
			return;
		}

		// Discord audit log records this reason, so keep it informative.
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		await validation.member.kick(reason);

		const embed = new EmbedBuilder()
			.setTitle('Member Kicked')
			.setDescription(`Kicked **${validation.member.user.tag}**`)
			.addFields({ name: 'Reason', value: reason }, { name: 'Moderator', value: interaction.user.tag })
			.setColor(0xff5e5b)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

export default kick;
