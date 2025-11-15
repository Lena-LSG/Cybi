/**
 * ================================================================
 * Name: Lock Command
 * Description: Toggles send-message permissions for @everyone on a channel.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Quickly lock or unlock channels during incidents.
 * Usage: `/lock [channel] [enabled] [reason]`
 * ================================================================
 */
import { ChannelType, SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { enforceModeratorAccess } from '../../lib/permissions.js';

const lock: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Lock or unlock a channel for @everyone.')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('Channel to lock (defaults to current)')
				.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
				.setRequired(false),
		)
		.addBooleanOption(option =>
			option
				.setName('enabled')
				.setDescription('Enable lock (true) or unlock (false). Default: true')
				.setRequired(false),
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('Reason for lock/unlock').setRequired(false),
		),
	async execute(interaction) {
		if (!(await enforceModeratorAccess(interaction))) {
			return;
		}

		if (!interaction.guild) {
			await interaction.reply({
				content: 'This command must be used in a guild.',
				ephemeral: true,
			});
			return;
		}

		// Default to the channel where the command was run if none provided.
		const channel =
			interaction.options.getChannel('channel') ?? (interaction.channel ?? undefined);

		if (!channel || channel.type === ChannelType.DM || channel.type === ChannelType.GroupDM) {
			await interaction.reply({
				content: 'You must target a guild text channel.',
				ephemeral: true,
			});
			return;
		}

		if (!('permissionOverwrites' in channel)) {
			await interaction.reply({
				content: 'This channel cannot be locked.',
				ephemeral: true,
			});
			return;
		}

		const enabled = interaction.options.getBoolean('enabled') ?? true;
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';

		// Toggle send/thread perms in one go; null resets to channel defaults.
		await channel.permissionOverwrites.edit(
			interaction.guild.roles.everyone,
			{
				SendMessages: enabled ? false : null,
				SendMessagesInThreads: enabled ? false : null,
				CreatePublicThreads: enabled ? false : null,
				CreatePrivateThreads: enabled ? false : null,
			},
			{ reason },
		);

		await interaction.reply({
			content: `${enabled ? 'Locked' : 'Unlocked'} ${channel} (${reason}).`,
		});
	},
};

export default lock;
