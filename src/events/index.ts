/**
 * ================================================================
 * Name: Event Orchestrator
 * Description: Registers all Discord gateway events used by the bot.
 * Created: 2025-11-14
 * Last Updated: 2025-11-15
 * Developer: Lena Gibson
 * Maintainer: Lena Gibson
 * Purpose: Keep event subscriptions centralized for easier maintenance.
 * Usage: Called from the bot bootstrap to hook ready + interaction events.
 * ================================================================
 */
import type { Client, Collection } from 'discord.js';
import { registerReadyEvent } from './ready.js';
import { registerInteractionHandler } from './interaction-create.js';
import type { BotCommand } from '../types/command.js';

export const registerEvents = (
	client: Client,
	commandMap: Collection<string, BotCommand>,
): void => {
	// Ready event logs identity + assures us the gateway handshake succeeded.
	registerReadyEvent(client as Client<true>);
	// Interaction handler owns all slash commands in one place for now.
	registerInteractionHandler(client, commandMap);
};
