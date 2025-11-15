/**
 * ================================================================
 * Name: tsup Build Config
 * Description: Bundler configuration for compiling the bot and scripts.
 * Created: 2025-11-14
 * Last Updated: 2025-11-14
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Define how TypeScript sources are built for production.
 * Usage: Invoked via `npm run build`.
 * ================================================================
 */
import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/bot.ts', 'src/scripts/deploy-commands.ts'],
	format: ['esm'],
	dts: false,
	splitting: false,
	sourcemap: true,
	clean: true,
	target: 'node20',
	skipNodeModulesBundle: true,
});
