/**
 * ================================================================
 * Name: Time Utilities
 * Description: Duration parsing and formatting helpers for moderation commands.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Convert human-readable durations to milliseconds (and vice versa).
 * Usage: `parseDuration('15m')` -> milliseconds.
 * ================================================================
 */

const UNIT_MS: Record<string, number> = {
	s: 1000,
	m: 60 * 1000,
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
};

export const parseDuration = (input: string): number | null => {
	const normalized = input.trim().toLowerCase();
	const matches = normalized.match(/(\d+)([smhd])/g);

	if (!matches) {
		return null;
	}

	let total = 0;
	// Supports goofy combos like "1h30m" because that's how we talk in chat.
	for (const match of matches) {
		const [, amountStr, unit] = match.match(/(\d+)([smhd])/) ?? [];
		if (!amountStr || !unit) {
			return null;
		}
		const multiplier = UNIT_MS[unit];
		total += Number(amountStr) * multiplier;
	}

	return total;
};

export const formatDuration = (milliseconds: number): string => {
	const seconds = Math.floor(milliseconds / 1000);
	const parts: string[] = [];

	const units: Array<[string, number]> = [
		['d', 86400],
		['h', 3600],
		['m', 60],
		['s', 1],
	];

	let remaining = seconds;
	for (const [label, size] of units) {
		const value = Math.floor(remaining / size);
		if (value > 0) {
			parts.push(`${value}${label}`);
			remaining %= size;
		}
	}

	// If duration is sub-second we still want *something* human readable.
	return parts.join(' ') || '0s';
};
