/**
 * ================================================================
 * Name: Slowmode Command
 * Description: Adjusts the slowmode rate limit on a text channel.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Throttle message flow during busy periods.
 * Usage: `/slowmode duration:<10s|5m|0s> [channel] [reason]`
 * ================================================================
 */
import {
	ChannelType,
	SlashCommandBuilder,
	type TextChannel,
	type NewsChannel,
	type Channel,
} from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';
import { parseDuration, formatDuration } from '../../lib/time.js';

const MAX_SLOWMODE_SECONDS = 21_600; // 6 hours

const resolveChannel = (
	explicit: Channel | null,
	fallback: Channel | null,
): (TextChannel | NewsChannel) | null => {
	// Prioritize explicit selection, fall back to where the command was run.
	const candidates = [explicit, fallback];
	for (const candidate of candidates) {
		if (!candidate) continue;
		if (candidate.type === ChannelType.GuildText) {
			return candidate as TextChannel;
		}
		if (candidate.type === ChannelType.GuildAnnouncement) {
			return candidate as NewsChannel;
		}
	}

	return null;
};

const slowmode: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Set or disable slowmode on a channel.')
		.addStringOption(option =>
			option
				.setName('duration')
				.setDescription('Use formats like 10s, 5m, 1h, or 0s to disable.')
				.setRequired(true),
		)
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('Channel to modify (defaults to current)')
				.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
				.setRequired(false),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Why are you changing slowmode?').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		const durationInput = interaction.options.getString('duration', true);
		const durationMs = parseDuration(durationInput);

		if (durationMs === null) {
			await interaction.reply({
				content: 'Invalid duration. Use values like `10s`, `5m`, or `0s` to disable.',
				ephemeral: true,
			});
			return;
		}

		const durationSeconds = Math.floor(durationMs / 1000);

		if (durationSeconds > MAX_SLOWMODE_SECONDS) {
			await interaction.reply({
				content: 'Slowmode cannot exceed 6 hours.',
				ephemeral: true,
			});
			return;
		}

		const resolvedChannel = resolveChannel(interaction.options.getChannel('channel') ?? null, interaction.channel ?? null);

		if (!resolvedChannel) {
			await interaction.reply({
				content: 'You must target a guild text or announcement channel.',
				ephemeral: true,
			});
			return;
		}

		// Document why the channel got throttled; helps when folks ask later.
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';

		const channel = resolvedChannel;

		await channel.setRateLimitPerUser(durationSeconds, reason);

		await interaction.reply({
			content:
				durationSeconds === 0
					? `Disabled slowmode in ${channel}.`
					: `Set slowmode in ${channel} to ${formatDuration(durationSeconds * 1000)}.`,
		});
	},
};

export default slowmode;
