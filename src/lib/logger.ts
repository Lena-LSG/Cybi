/**
 * ================================================================
 * Name: Logger Factory
 * Description: Configures the shared Pino logger for the bot.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Provide consistent structured logging across runtime modules.
 * Usage: Import `logger` and log via `logger.info|error` etc.
 * ================================================================
 */
import pino from 'pino';

const logger = pino({
	name: 'hearth-bot',
	level: process.env.LOG_LEVEL ?? 'info',
	// Pretty logs for dev, structured JSON for prod so both humans and machines stay happy.
	transport:
		process.env.NODE_ENV === 'development'
			? {
					target: 'pino-pretty',
					options: {
						ignore: 'pid,hostname',
					},
			  }
			: undefined,
});

export default logger;
