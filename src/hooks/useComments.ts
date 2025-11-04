/**
 * useComments Hook
 *
 * Manages all comment-related state in one place.
 * This hook:
 * - Initializes the Yjs document and thread store
 * - Handles user switching
 * - Provides loading states
 * - Centralizes comment logic for easy reuse
 */

import { useState, useEffect } from 'react';
import { createYjsDocument } from '../lib/yjs-setup';
import { createThreadStore } from '../lib/thread-store';
import { getCurrentUser, resolveUsers } from '../lib/users';
import type { UseCommentsReturn, User } from '../types';

export function useComments(): UseCommentsReturn {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(getCurrentUser());

  // Yjs document state
  const [yjsDoc, setYjsDoc] = useState<UseCommentsReturn['yjsDoc']>(null);

  // Thread store state
  const [threadStore, setThreadStore] = useState<UseCommentsReturn['threadStore']>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize Yjs document and thread store on mount
   * This only runs once when the component first loads
   */
  useEffect(() => {
    async function init() {
      setIsLoading(true);

      try {
        // Create and load Yjs document from IndexedDB
        const { doc } = await createYjsDocument();
        setYjsDoc(doc);

        // Create thread store with current user
        const store = createThreadStore(doc, currentUser);
        setThreadStore(store);

        console.log('✅ Comments system initialized');
        console.log('Current user:', currentUser.username, `(${currentUser.role})`);

        setIsLoading(false);
      } catch (error) {
        console.error('❌ Failed to initialize comments:', error);
        setIsLoading(false);
      }
    }

    init();
  }, []);

  /**
   * Update thread store when user changes
   * This creates a new thread store with the new user's permissions
   */
  useEffect(() => {
    if (yjsDoc) {
      const store = createThreadStore(yjsDoc, currentUser);
      setThreadStore(store);
      console.log('🔄 Thread store updated for user:', currentUser.username);
    }
  }, [currentUser, yjsDoc]);

  return {
    currentUser,
    setCurrentUser,
    yjsDoc,
    threadStore,
    resolveUsers,
    isLoading
  };
}
