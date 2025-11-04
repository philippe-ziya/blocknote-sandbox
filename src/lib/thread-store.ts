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
import type * as Y from 'yjs';
import type { User } from '../types';

/**
 * Create thread store
 *
 * @param doc - The Yjs document for persistence
 * @param currentUser - The current user object
 * @returns Configured thread store
 */
export function createThreadStore(doc: Y.Doc, currentUser: User): YjsThreadStore {
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
