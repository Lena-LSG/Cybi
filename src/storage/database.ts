/**
 * ================================================================
 * Name: Database Helper
 * Description: Provides a singleton SQLite connection with schema bootstrap.
 * Created: 2025-11-15
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Centralise access to the SQLite database for bot storage.
 * Usage: Import `db` and use prepared statements or helper functions.
 * ================================================================
 */
import Database from 'better-sqlite3';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'hearth-bot.db');

const migrate = (connection: Database.Database) => {
	// One table for now; future tables should land in migrations just like this.
	connection
		.prepare(
			`CREATE TABLE IF NOT EXISTS warnings (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				moderator_id TEXT NOT NULL,
				reason TEXT NOT NULL,
				interaction_id TEXT UNIQUE NOT NULL,
				created_at TEXT NOT NULL
			);`,
		)
		.run();

	connection.prepare(`CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(user_id);`).run();
	connection
		.prepare(`CREATE INDEX IF NOT EXISTS idx_warnings_created ON warnings(created_at);`)
		.run();
};

// Ensure data dir exists before SQLite tries to write the file.
await fs.mkdir(dataDir, { recursive: true });

export const db = new Database(dbPath);

// Running migrations synchronously keeps startup predictable.
migrate(db);
