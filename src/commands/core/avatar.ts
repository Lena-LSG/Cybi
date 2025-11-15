/**
 * ================================================================
 * Name: Avatar Command
 * Description: Displays the avatar of the invoking user or an optional target user.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide quick access to high-resolution profile images.
 * Usage: `/avatar [user]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';

const buildEmbed = (requesterTag: string, username: string, avatarUrl: string) => {
	return new EmbedBuilder()
		.setTitle(`${username}'s avatar`)
		.setImage(avatarUrl)
		.setColor(0xf1a5c7)
		// Attribution keeps us honest about who ran the command.
		.setFooter({ text: `Requested by ${requesterTag}` })
		.setTimestamp();
};

const avatar: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Display the avatar of yourself or another user.')
		.addUserOption(option =>
			option.setName('user').setDescription('User to fetch the avatar for').setRequired(false),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
		const embed = buildEmbed(
			interaction.user.tag,
			target.username,
			target.displayAvatarURL({ size: 1024 }),
		);

		// No ephemeral here; folks usually want to share the avatar.
		await interaction.reply({
			embeds: [embed],
		});
	},
};

export default avatar;
