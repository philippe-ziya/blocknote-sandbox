/**
 * Thread Store Configuration
 *
 * Creates and configures the ThreadStore for managing comments.
 * The ThreadStore handles:
 * - Creating, editing, and deleting comment threads
 * - Authorization (who can do what)
 * - Persistence through the Yjs document
 */

import { YjsThreadStore, DefaultThreadStoreAuth } from '@blocknote/core';

/**
 * Create thread store with authorization
 *
 * @param {Y.Doc} doc - The Yjs document for persistence
 * @param {Object} currentUser - The current user object
 * @returns {YjsThreadStore} Configured thread store
 */
export function createThreadStore(doc, currentUser) {
  // Set up authorization rules
  // This controls what the current user can do with comments
  const auth = new DefaultThreadStoreAuth(
    currentUser.id,
    currentUser.role // 'editor' or 'comment'
  );

  // Create the thread store
  // This connects the Yjs document with BlockNote's commenting system
  const threadStore = new YjsThreadStore(doc, auth);

  return threadStore;
}

/**
 * Authorization Rules (DefaultThreadStoreAuth):
 *
 * Editor Role:
 * - Can create new comment threads
 * - Can edit any comment (their own or others)
 * - Can delete any comment
 * - Can resolve/unresolve threads
 *
 * Comment Role:
 * - Can create new comment threads
 * - Can only edit their own comments
 * - Cannot delete comments
 * - Can resolve/unresolve threads they created
 */
