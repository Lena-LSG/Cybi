/**
 * ================================================================
 * Name: Ping Command
 * Description: Simple slash command that reports round-trip latency.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide a sanity check command to verify the bot is responsive.
 * Usage: `/ping`
 * ================================================================
 */
import { SlashCommandBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';

const ping: BotCommand = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with the bot latency.'),
	async execute(interaction) {
		// Reply first so Discord records the interaction while we measure.
		await interaction.reply({ content: 'Pinging...' });
		const sent = await interaction.fetchReply();
		const latency = sent.createdTimestamp - interaction.createdTimestamp;
		// Old-school latency metric still helps when diagnosing gateway issues.
		await interaction.editReply(`Pong! Round-trip latency: ${latency}ms`);
	},
};

export default ping;
