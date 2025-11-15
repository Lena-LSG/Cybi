/**
 * ================================================================
 * Name: Google Command
 * Description: Performs a Google Custom Search and returns top results.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide quick web searches without leaving Discord.
 * Usage: `/google query:<text> [results:<1-5>]`
 * ================================================================
 */
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { BotCommand } from '../../types/command.js';
import { googleSearch, isGoogleSearchEnabled } from '../../services/google-search.js';
import logger from '../../lib/logger.js';

const googleCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('google')
		.setDescription('Search the web via Google.')
		.addStringOption(option =>
			option.setName('query').setDescription('What to search for').setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('results')
				.setDescription('Number of results to show (1-5)')
				.setMinValue(1)
				.setMaxValue(5)
				.setRequired(false),
		),
	async execute(interaction) {
		if (!isGoogleSearchEnabled()) {
			// Keeps the command available without API creds so users know why it fails.
			await interaction.reply({
				content: 'Google search is not configured for this bot.',
				ephemeral: true,
			});
			return;
		}

		const query = interaction.options.getString('query', true);
		const limit = interaction.options.getInteger('results') ?? 3;

		// External HTTP call can take a sec; defer to keep Discord happy.
		await interaction.deferReply();

		try {
			const results = await googleSearch(query, limit);

			if (results.length === 0) {
				await interaction.editReply(`No results found for **${query}**.`);
				return;
			}

			// Stick with embeddeds to keep links tidy and avoid formatting gymnastics.
			const embed = new EmbedBuilder()
				.setTitle(`Results for "${query}"`)
				.setColor(0x4285f4)
				.setDescription(
					results
						.map(result => `**[${result.title}](${result.link})**\n${result.snippet}`)
						.join('\n\n'),
				)
				.setFooter({ text: 'Powered by Google Custom Search' });

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			logger.error({ err: error }, 'Google search command failed');
			await interaction.editReply('Sorry, something went wrong while performing that search.');
		}
	},
};

export default googleCommand;
