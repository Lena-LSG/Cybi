/**
 * ================================================================
 * Name: Moderation Helpers
 * Description: Shared validation helpers for moderation commands.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Avoid duplicated checks (self-targeting, bot interactions, manageability).
 * Usage: Call `validateTargetMember` before executing moderation actions.
 * ================================================================
 */
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

export interface TargetValidationResult {
	member: GuildMember;
}

export const validateTargetMember = async (
	interaction: ChatInputCommandInteraction,
	userOptionName: string,
	actionLabel: string,
): Promise<TargetValidationResult | null> => {
	if (!interaction.guild) {
		await interaction.reply({
			content: 'This command can only be used inside a server.',
			ephemeral: true,
		});
		return null;
	}

	const targetUser = interaction.options.getUser(userOptionName, true);

	if (targetUser.bot) {
		await interaction.reply({
			content: `You cannot ${actionLabel} a bot.`,
			ephemeral: true,
		});
		return null;
	}

	if (targetUser.id === interaction.user.id) {
		await interaction.reply({
			content: `You cannot ${actionLabel} yourself.`,
			ephemeral: true,
		});
		return null;
	}

	// Fetch the actual guild member to ensure role hierarchy won't smack us later.
	const member = await interaction.guild.members.fetch(targetUser.id);
	if (!member.manageable) {
		await interaction.reply({
			content: `I do not have permission to ${actionLabel} ${targetUser.tag}.`,
			ephemeral: true,
		});
		return null;
	}

	return { member };
};
