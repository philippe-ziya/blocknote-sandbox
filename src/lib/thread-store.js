/**
 * Thread Store Configuration
 *
 * Creates and configures the ThreadStore for managing comments.
 * The ThreadStore handles:
 * - Creating, editing, and deleting comment threads
 * - Authorization (who can do what)
 * - Persistence through the Yjs document
 */

import { YjsThreadStore, DefaultThreadStoreAuth } from '@blocknote/core/comments';

/**
 * Create thread store
 *
 * @param {Y.Doc} doc - The Yjs document for persistence
 * @param {Object} currentUser - The current user object
 * @returns {YjsThreadStore} Configured thread store
 */
export function createThreadStore(doc, currentUser) {
  // Create authorization
  const auth = new DefaultThreadStoreAuth(
    currentUser.id,
    currentUser.role
  );

  // Create the thread store
  // First parameter: userId, Second: Yjs Map, Third: auth
  const threadStore = new YjsThreadStore(
    currentUser.id,
    doc.getMap('threads'),
    auth
  );

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
