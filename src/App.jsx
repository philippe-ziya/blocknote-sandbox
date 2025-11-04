/**
 * Main Application Component - Comments Version
 *
 * This is the top-level component that:
 * - Manages comment system state via useComments hook
 * - Provides two-column layout (editor + optional sidebar)
 * - Handles sidebar toggle
 * - Manages user switching
 * - Provides clear data functionality
 */

import { useState } from 'react';
import { Editor } from './components/Editor';
import { CommentsSidebar } from './components/CommentsSidebar';
import { UserSelector } from './components/UserSelector';
import { useComments } from './hooks/useComments';
import { clearStoredData } from './lib/yjs-setup';
import './App.css';

function App() {
  // Initialize comment system
  const {
    currentUser,
    setCurrentUser,
    yjsDoc,
    threadStore,
    resolveUsers,
    isLoading
  } = useComments();

  // Editor instance state
  const [editor, setEditor] = useState(null);

  // Sidebar toggle state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  /**
   * Handle clear all data
   * Clears both editor content AND comments from IndexedDB
   */
  const handleClearData = async () => {
    if (window.confirm('Clear all editor content and comments? This cannot be undone.')) {
      try {
        await clearStoredData();
        console.log('🗑️ All data cleared');
        window.location.reload();
      } catch (error) {
        console.error('❌ Failed to clear data:', error);
        alert('Failed to clear data. Check console for details.');
      }
    }
  };

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    console.log('👁️ Sidebar', !isSidebarVisible ? 'shown' : 'hidden');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <p>Loading comments system...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>BlockNote Sandbox - Comments</h1>

          <div className="header-controls">
            <UserSelector
              currentUser={currentUser}
              onUserChange={setCurrentUser}
            />

            <button
              onClick={toggleSidebar}
              className="toggle-button"
              title={isSidebarVisible ? 'Hide comments' : 'Show comments'}
            >
              {isSidebarVisible ? '➡️ Hide Comments' : '⬅️ Show Comments'}
            </button>

            <button
              onClick={handleClearData}
              className="clear-button"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="editor-container">
          <Editor
            yjsDoc={yjsDoc}
            threadStore={threadStore}
            resolveUsers={resolveUsers}
            currentUser={currentUser}
            onEditorReady={setEditor}
          />
        </div>

        {isSidebarVisible && (
          <CommentsSidebar editor={editor} />
        )}
      </main>
    </div>
  );
}

export default App;
