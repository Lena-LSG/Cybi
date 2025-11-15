/**
 * ================================================================
 * Name: Server Info Command
 * Description: Reports owner, member stats, boost tier, and creation time for the guild.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Give admins/users a quick snapshot of the current server.
 * Usage: `/serverinfo`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } from 'discord.js';
import type { BotCommand } from '../../types/command.js';

const serverInfo: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Display information about the current server.'),
	async execute(interaction) {
		if (!interaction.guild) {
			// Slash commands can run in DMs; bail with a humane message.
			await interaction.reply({
				content: 'This command can only be used inside a server.',
				ephemeral: true,
			});
			return;
		}

		const { guild } = interaction;

		const owner = await guild.fetchOwner();
		const embed = new EmbedBuilder()
			.setTitle(guild.name)
			.setThumbnail(guild.iconURL({ size: 512 }) ?? undefined)
			.addFields(
				{
					name: 'Owner',
					value: owner.user.tag,
					inline: true,
				},
				{
					name: 'Members',
					value: `${guild.memberCount}`,
					inline: true,
				},
				{
					name: 'Boost Tier',
					value: guild.premiumTier ? `Level ${guild.premiumTier}` : 'None',
					inline: true,
				},
				{
					name: 'Created',
					value: `${time(guild.createdAt, TimestampStyles.RelativeTime)} (${time(
						guild.createdAt,
						TimestampStyles.LongDate,
					)})`,
				},
			)
			.setColor(0x9acfe5)
			.setFooter({ text: `Guild ID: ${guild.id}` });

		// Public info so regular reply is fine.
		await interaction.reply({
			embeds: [embed],
		});
	},
};

export default serverInfo;
