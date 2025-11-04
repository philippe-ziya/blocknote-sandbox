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
 * - showSidebar: Whether to show the comments sidebar
 */

import { useEffect } from 'react';
import { useCreateBlockNote, BlockNoteViewEditor, ThreadsSidebar, FloatingComposerController } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import type { EditorProps } from '../types';

export function Editor({ yjsDoc, threadStore, resolveUsers, currentUser, onEditorReady, showSidebar }: EditorProps) {
  // Create editor with collaboration and commenting enabled
  const editor = useCreateBlockNote({
    // Function to resolve user IDs to user objects
    // This is used to display user names and colors in comments
    resolveUsers,

    // Comments configuration
    comments: {
      // Thread store for managing comment threads
      threadStore
    },

    // Collaboration configuration
    collaboration: {
      // Yjs XML fragment for storing BlockNote data
      // This is where the editor content is stored in the Yjs document
      fragment: yjsDoc.getXmlFragment('document-store'),

      // No provider needed for local-only mode
      // In the future, you can add a WebSocket provider here for real-time collaboration
      provider: null,

      // Current user info for collaboration cursors
      user: {
        id: currentUser.id,
        name: currentUser.username,
        color: currentUser.color
      }
    }
  });

  // Notify parent when editor is ready (using useEffect to avoid setState during render)
  useEffect(() => {
    if (onEditorReady && editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className="editor-wrapper">
      <BlockNoteView
        editor={editor}
        theme="light"
        renderEditor={false}
        comments={false}
      >
        {/* FloatingComposerController provides the UI for creating new comment threads */}
        <FloatingComposerController />

        <div className="editor-content">
          <BlockNoteViewEditor />
        </div>

        {showSidebar && (
          <div className="comments-sidebar">
            <div className="comments-header">
              <h2>Comments</h2>
              <p className="comments-subtitle">
                Select text to add a comment
              </p>
            </div>
            <ThreadsSidebar
              filter="all"
              sort="position"
              maxCommentsBeforeCollapse={3}
            />
          </div>
        )}
      </BlockNoteView>
    </div>
  );
}
