/**
 * ================================================================
 * Name: Warning Storage
 * Description: SQLite-backed persistence helpers for moderation warnings.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Store/retrieve warning records issued by moderators.
 * Usage: Import `addWarning`, `getWarningsForUser`, `clearWarningsForUser`.
 * ================================================================
 */
import { randomUUID } from 'node:crypto';
import { db } from './database.js';
import { env } from '../config/env.js';

export interface WarningRecord {
	id: string;
	userId: string;
	moderatorId: string;
	reason: string;
	interactionId: string;
	createdAt: string;
}

interface WarningRow {
	id: string;
	user_id: string;
	moderator_id: string;
	reason: string;
	interaction_id: string;
	created_at: string;
}

const insertStmt = db.prepare(
	`INSERT INTO warnings (id, user_id, moderator_id, reason, interaction_id, created_at)
  VALUES (@id, @user_id, @moderator_id, @reason, @interaction_id, @created_at);`,
);

const selectByInteractionStmt = db.prepare(
	`SELECT * FROM warnings WHERE interaction_id = ? LIMIT 1;`,
);

const selectByUserStmt = db.prepare(
	`SELECT * FROM warnings WHERE user_id = ? ORDER BY datetime(created_at) DESC;`,
);

const deleteByUserStmt = db.prepare(`DELETE FROM warnings WHERE user_id = ?;`);

const deleteOlderThanStmt = db.prepare(`DELETE FROM warnings WHERE datetime(created_at) < ?;`);

const mapRow = (row: WarningRow): WarningRecord => ({
	id: row.id,
	userId: row.user_id,
	moderatorId: row.moderator_id,
	reason: row.reason,
	interactionId: row.interaction_id,
	createdAt: row.created_at,
});

const enforceRetention = () => {
	if (!env.warningRetentionDays) {
		return;
	}

	const cutoff = new Date(
		Date.now() - env.warningRetentionDays * 24 * 60 * 60 * 1000,
	).toISOString();
	deleteOlderThanStmt.run(cutoff);
};

export const addWarning = async (
	userId: string,
	moderatorId: string,
	reason: string,
	interactionId: string,
): Promise<WarningRecord> => {
	enforceRetention();
	// Deduplicate based on Discord interaction id so retries don't spam the DB.
	const existingRow = selectByInteractionStmt.get(interactionId) as WarningRow | undefined;
	if (existingRow) {
		return mapRow(existingRow);
	}

	const record: WarningRecord = {
		id: randomUUID(),
		userId,
		moderatorId,
		reason,
		interactionId,
		createdAt: new Date().toISOString(),
	};

	insertStmt.run({
		id: record.id,
		user_id: record.userId,
		moderator_id: record.moderatorId,
		reason: record.reason,
		interaction_id: record.interactionId,
		created_at: record.createdAt,
	});

	return record;
};

export const getWarningsForUser = async (userId: string): Promise<WarningRecord[]> => {
	enforceRetention();
	const rows = selectByUserStmt.all(userId) as WarningRow[];
	return rows.map(mapRow);
};

export const clearWarningsForUser = async (userId: string): Promise<number> => {
	const info = deleteByUserStmt.run(userId);
	// SQLite gives us change count so we can tell mods how many records vanished.
	return info.changes ?? 0;
};
