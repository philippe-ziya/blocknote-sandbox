/**
 * Yjs Document Setup with IndexedDB Persistence
 *
 * This module handles:
 * - Creating Yjs documents for collaboration
 * - Setting up IndexedDB persistence (no server needed)
 * - Clearing stored data on demand
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import type { YjsDocumentResult } from '../types';

const DATABASE_NAME = 'blocknote-sandbox-comments';

/**
 * Create a Yjs document with IndexedDB persistence
 *
 * This creates a Y.Doc that automatically syncs with IndexedDB.
 * All changes are persisted locally, surviving page refreshes.
 *
 * @returns Promise that resolves when the document is loaded from storage
 */
export function createYjsDocument(): Promise<YjsDocumentResult> {
  // Create a new Yjs document
  const doc = new Y.Doc();

  // Set up IndexedDB persistence
  const persistence = new IndexeddbPersistence(DATABASE_NAME, doc);

  // Return a promise that resolves when synced
  return new Promise((resolve) => {
    persistence.on('synced', () => {
      console.log('✅ Yjs document loaded from IndexedDB');
      resolve({ doc, persistence });
    });
  });
}

/**
 * Clear all stored data from IndexedDB
 *
 * This removes both editor content and comments.
 * Useful for resetting the sandbox to a clean state.
 *
 * @returns Promise that resolves when data is cleared
 */
export async function clearStoredData(): Promise<void> {
  // Create a temporary doc just for clearing
  const doc = new Y.Doc();
  const persistence = new IndexeddbPersistence(DATABASE_NAME, doc);

  // Wait for sync, then clear
  await new Promise<void>((resolve) => {
    persistence.on('synced', () => {
      persistence.clearData().then(() => {
        console.log('🗑️ All stored data cleared from IndexedDB');
        resolve();
      });
    });
  });
}
