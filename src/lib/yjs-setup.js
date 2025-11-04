/**
 * Yjs Document Setup with IndexedDB Persistence
 *
 * Creates and configures a Yjs document for collaborative editing.
 * Uses IndexedDB to persist data in the browser (survives page refreshes).
 *
 * What is Yjs?
 * - A CRDT (Conflict-free Replicated Data Type) library
 * - Enables real-time collaboration
 * - Works offline-first
 * - Used by Figma, Linear, and other collaborative tools
 *
 * Why IndexedDB?
 * - More storage than localStorage (gigabytes vs 5-10MB)
 * - Better performance for large documents
 * - Standard approach for offline-first apps
 * - Still no backend required
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

/**
 * Create and configure Yjs document for the editor
 * @returns {Promise<{doc: Y.Doc, persistence: IndexeddbPersistence}>}
 */
export function createYjsDocument() {
  // Create new Yjs document
  // This is the core data structure that holds both editor content and comments
  const doc = new Y.Doc();

  // Set up IndexedDB persistence
  // This stores the document in the browser's IndexedDB
  // Database name: 'blocknote-sandbox-comments'
  const persistence = new IndexeddbPersistence(
    'blocknote-sandbox-comments', // Database name
    doc
  );

  // Wait for initial data to load from IndexedDB
  // This ensures we don't render the editor before data is loaded
  return new Promise((resolve) => {
    persistence.on('synced', () => {
      console.log('✅ Yjs document loaded from IndexedDB');
      resolve({ doc, persistence });
    });
  });
}

/**
 * Clear all stored data
 * Useful for testing and the "Clear All Data" button
 * @returns {Promise<void>}
 */
export async function clearStoredData() {
  // Create a new document and persistence instance
  const doc = new Y.Doc();
  const persistence = new IndexeddbPersistence(
    'blocknote-sandbox-comments',
    doc
  );

  // Wait for sync, then clear all data
  await new Promise((resolve) => {
    persistence.on('synced', () => {
      persistence.clearData().then(() => {
        console.log('🗑️ All stored data cleared from IndexedDB');
        resolve();
      });
    });
  });
}
