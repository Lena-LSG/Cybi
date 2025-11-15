/**
 * ================================================================
 * Name: Mute Command
 * Description: Applies a Discord timeout to a member for a specified duration.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Temporarily restrict disruptive members from sending messages.
 * Usage: `/mute user:<member> duration:<10m|2h|1d> [reason]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { validateTargetMember } from '../../lib/moderation.js';
import { formatDuration, parseDuration } from '../../lib/time.js';

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // 28 days per Discord limit

const mute: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Temporarily mute (timeout) a member.')
		.addUserOption(option =>
			option.setName('user').setDescription('Member to mute').setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('duration')
				.setDescription('Duration (e.g., 10m, 2h, 1d)')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are they being muted?').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const validation = await validateTargetMember(interaction, 'user', 'mute');
		if (!validation) {
			return;
		}

		const durationInput = interaction.options.getString('duration', true);
		const durationMs = parseDuration(durationInput);

		if (!durationMs) {
			await interaction.reply({
				content: 'Invalid duration. Use a format like `10m`, `2h`, or `1d`.',
				ephemeral: true,
			});
			return;
		}

		if (durationMs > MAX_TIMEOUT_MS) {
			await interaction.reply({
				content: 'Duration exceeds Discord’s 28 day timeout limit.',
				ephemeral: true,
			});
			return;
		}

		// Discord doesn't require reasons but I prefer an audit trail.
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';

		await validation.member.timeout(durationMs, reason);

		const embed = new EmbedBuilder()
			.setTitle('Member Muted')
			.setDescription(
				`Muted **${validation.member.user.tag}** for ${formatDuration(durationMs)}.`,
			)
			.addFields({ name: 'Reason', value: reason }, { name: 'Moderator', value: interaction.user.tag })
			.setColor(0xf5a623)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

export default mute;
