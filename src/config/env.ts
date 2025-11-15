/**
 * ================================================================
 * Name: Environment Loader
 * Description: Loads and validates environment variables for the bot runtime.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Ensure required Discord credentials/config exist before bootstrapping.
 * Usage: Imported by runtime modules; automatically loads `.env` via dotenv.
 * ================================================================
 */
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
	DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
	DISCORD_GUILD_ID: z.string().optional(),
	MODERATOR_ROLE_IDS: z.string().optional(),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	WARNING_RETENTION_DAYS: z
		.preprocess(value => {
			if (value === undefined) {
				return 180;
			}
			const parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : undefined;
		}, z.number().int().positive())
		.default(180),
	GOOGLE_API_KEY: z.string().optional(),
	GOOGLE_CSE_ID: z.string().optional(),
});

// Parse-and-validate in one shot so we fail fast instead of discovering ghosts later.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Invalid environment configuration:');
	console.error(parsed.error.format());
	process.exit(1);
}

export const env = {
	token: parsed.data.DISCORD_TOKEN,
	clientId: parsed.data.DISCORD_CLIENT_ID,
	guildId: parsed.data.DISCORD_GUILD_ID,
	nodeEnv: parsed.data.NODE_ENV,
	moderatorRoleIds:
		parsed.data.MODERATOR_ROLE_IDS?.split(',').map(id => id.trim()).filter(Boolean) ?? [],
	// Give ourselves a sane default retention so the DB doesn't balloon on tiny servers.
	warningRetentionDays: parsed.data.WARNING_RETENTION_DAYS,
	googleApiKey: parsed.data.GOOGLE_API_KEY,
	googleCseId: parsed.data.GOOGLE_CSE_ID,
};
