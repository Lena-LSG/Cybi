/**
 * ================================================================
 * Name: Google Search Service
 * Description: Wraps Google Custom Search API for slash commands.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide a simple interface for performing web searches.
 * Usage: Call `googleSearch(query, limit)` to fetch results.
 * ================================================================
 */
import { google } from 'googleapis';
import { env } from '../config/env.js';

export interface SearchResult {
	title: string;
	link: string;
	snippet: string;
}

const customSearch = google.customsearch('v1');

export const isGoogleSearchEnabled = (): boolean => {
	return Boolean(env.googleApiKey && env.googleCseId);
};

export const googleSearch = async (query: string, limit = 3): Promise<SearchResult[]> => {
	if (!isGoogleSearchEnabled()) {
		throw new Error('Google Search API is not configured.');
	}

	// Delegate to the official SDK so we don't reinvent REST plumbing.
	const response = await customSearch.cse.list({
		auth: env.googleApiKey,
		cx: env.googleCseId,
		q: query,
		num: limit,
	});

	const items = response.data.items ?? [];
	// Trim output to exactly what we use—title/link/snippet—for clean embeds.
	return items.map(item => ({
		title: item.title ?? 'Untitled result',
		link: item.link ?? 'https://google.com',
		snippet: item.snippet ?? 'No description available.',
	}));
};
