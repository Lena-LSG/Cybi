/**
 * ================================================================
 * Name: Permissions Helper
 * Description: Utility functions for role/permission-based access checks.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Ensure only authorized moderators can run sensitive commands.
 * Usage: Call `enforceModeratorAccess` inside command executors.
 * ================================================================
 */
import {
	PermissionFlagsBits,
	type ChatInputCommandInteraction,
	type GuildMember,
} from 'discord.js';
import { env } from '../config/env.js';

const hasModeratorRole = (member: GuildMember): boolean => {
	if (env.moderatorRoleIds.length === 0) {
		// No override configured, fall back to Discord perms only.
		return false;
	}

	return env.moderatorRoleIds.some(roleId => member.roles.cache.has(roleId));
};

export const enforceModeratorAccess = async (
	interaction: ChatInputCommandInteraction,
): Promise<boolean> => {
	if (!interaction.inCachedGuild()) {
		await interaction.reply({
			content: 'This command can only be used inside a server.',
			ephemeral: true,
		});
		return false;
	}

	// Discord's own permission bit is the first gate; roles are optional overrides.
	const hasPermission =
		interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers, true) ?? false;
	const hasRole = hasModeratorRole(interaction.member);

	if (!hasPermission && !hasRole) {
		await interaction.reply({
			content: 'You do not have permission to use this command.',
			ephemeral: true,
		});
		return false;
	}

	return true;
};
