/**
 * Comments Sidebar Component
 *
 * Displays all comment threads in a sidebar panel.
 * Uses BlockNote's built-in ThreadsSidebar component.
 *
 * Features:
 * - Shows all comments from the editor
 * - Filter by open/resolved
 * - Sort by position/recent/oldest
 * - Threading (replies to comments)
 * - Emoji reactions
 *
 * Props:
 * - editor: The BlockNote editor instance
 */

import { ThreadsSidebar } from '@blocknote/react';
import '@blocknote/mantine/style.css';

export function CommentsSidebar({ editor }) {
  // Show loading state if editor isn't ready yet
  if (!editor) {
    return (
      <div className="comments-sidebar">
        <div className="comments-header">
          <h2>Comments</h2>
        </div>
        <div className="comments-empty">
          Loading comments...
        </div>
      </div>
    );
  }

  return (
    <div className="comments-sidebar">
      <div className="comments-header">
        <h2>Comments</h2>
        <p className="comments-subtitle">
          Select text to add a comment
        </p>
      </div>

      {/* ThreadsSidebar is a pre-built component from BlockNote */}
      <ThreadsSidebar
        editor={editor}
        filter="all"        // Show all comments (open + resolved)
        sort="position"     // Sort by position in document
        maxCommentsBeforeCollapse={3}  // Collapse long threads
      />
    </div>
  );
}

/**
 * Sidebar Configuration Options:
 *
 * filter:
 * - "all": Show all comments (open + resolved)
 * - "open": Show only unresolved comments
 * - "resolved": Show only resolved comments
 *
 * sort:
 * - "position": Sort by position in document (top to bottom)
 * - "recent-activity": Sort by most recently active
 * - "oldest": Sort by creation date (oldest first)
 *
 * maxCommentsBeforeCollapse:
 * - Number of comments to show before collapsing the thread
 * - Useful for long comment threads
 */
