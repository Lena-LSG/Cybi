/**
 * ================================================================
 * Name: Bot Command Type
 * Description: Interface describing the shape of all slash command modules.
 * Created: 2025-11-14
 * Last Updated: 2025-11-14
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Enforce consistency across command implementations.
 * Usage: Import `BotCommand` when authoring new commands.
 * ================================================================
 */
import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface BotCommand {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandOptionsOnlyBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
