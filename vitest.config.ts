/**
 * ================================================================
 * Name: Vitest Config
 * Description: Test runner configuration with V8 coverage.
 * Created: 2025-11-14
 * Last Updated: 2025-11-14
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Standardize how automated tests execute.
 * Usage: Applied automatically when running `npm run test`.
 * ================================================================
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			enabled: true,
			provider: 'v8',
		},
	},
});
