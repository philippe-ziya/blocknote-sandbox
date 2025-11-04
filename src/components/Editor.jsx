/**
 * Editor Component with Comments Support
 *
 * This wraps the BlockNote editor functionality with:
 * - Yjs collaboration (for shared state)
 * - Comment threading support
 * - User identification
 * - Persistent storage via IndexedDB
 *
 * Props:
 * - yjsDoc: The Yjs document for shared state
 * - threadStore: The thread store for managing comments
 * - resolveUsers: Function to resolve user IDs to user objects
 * - currentUser: The current user object
 * - onEditorReady: Callback when editor is created (optional)
 */

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

export function Editor({ yjsDoc, threadStore, resolveUsers, currentUser, onEditorReady }) {
  // Create editor with collaboration and commenting enabled
  const editor = useCreateBlockNote({
    collaboration: {
      // Yjs document for shared state (editor content + comments)
      document: yjsDoc,

      // No provider needed for local-only mode
      // In the future, you can add a WebSocket provider here for real-time collaboration
      provider: null,

      // Thread store for comments
      threadStore: threadStore,

      // Function to resolve user IDs to user objects
      // This is used to display user names and colors in comments
      resolveUsers: resolveUsers,

      // Current user info
      user: {
        id: currentUser.id,
        name: currentUser.username,
        color: currentUser.color
      }
    }
  });

  // Notify parent when editor is ready
  if (onEditorReady && editor) {
    onEditorReady(editor);
  }

  return (
    <div className="editor-wrapper">
      <BlockNoteView
        editor={editor}
        theme="light"
      />
    </div>
  );
}
