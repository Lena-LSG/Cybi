/**
 * ================================================================
 * Name: Ban Command
 * Description: Bans a user from the guild and optionally deletes recent messages.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide moderators a hard stop for severe violations.
 * Usage: `/ban user:<member> [delete_days] [reason]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { validateTargetMember } from '../../lib/moderation.js';

const ban: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user from the server.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to ban').setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('delete_days')
				.setDescription('Delete message history (0-7 days)')
				.setRequired(false)
				.setMinValue(0)
				.setMaxValue(7),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are they being banned?').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const validation = await validateTargetMember(interaction, 'user', 'ban');
		if (!validation) {
			return;
		}

		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		const deleteDays = interaction.options.getInteger('delete_days') ?? 0;

		// Banning via guild API ensures we can optionally prune message history.
		await interaction.guild?.members.ban(validation.member.user, {
			deleteMessageDays: deleteDays,
			reason,
		});

		const embed = new EmbedBuilder()
			.setTitle('User Banned')
			.setDescription(`Banned **${validation.member.user.tag}**`)
			.addFields(
				{ name: 'Reason', value: reason },
				{ name: 'Deleted Messages', value: `${deleteDays} day(s)` },
				{ name: 'Moderator', value: interaction.user.tag },
			)
			.setColor(0xc0392b)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

export default ban;
