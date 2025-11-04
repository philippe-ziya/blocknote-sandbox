/**
 * Main Application Component - Comments + AI Version
 *
 * This is the top-level component that:
 * - Manages comment system state via useComments hook
 * - Provides two-column layout (editor + optional sidebar)
 * - Handles sidebar toggle
 * - Manages user switching
 * - Provides clear data functionality
 * - AI-powered content generation via AIInput component
 */

import { useState } from 'react';
import type { BlockNoteEditor } from '@blocknote/core';
import { Editor } from './components/Editor';
import { UserSelector } from './components/UserSelector';
import { AIInput } from './components/AIInput';
import { useComments } from './hooks/useComments';
import { useAIGeneration } from './hooks/useAIGeneration';
import { clearStoredData } from './lib/yjs-setup';
import { isOpenAIConfigured } from './lib/openai';
import type { User } from './types';
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
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  // AI generation hook
  const { generate, isGenerating, error: aiError } = useAIGeneration(editor);

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

  // TypeScript requires us to check for null before using yjsDoc and threadStore
  if (!yjsDoc || !threadStore) {
    return (
      <div className="app-loading">
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>BlockNote Sandbox - AI + Comments</h1>

          <div className="header-controls">
            {isOpenAIConfigured() ? (
              <span className="api-status" style={{ fontSize: '14px', color: '#059669' }}>
                ✅ AI Ready
              </span>
            ) : (
              <span className="api-status" style={{ fontSize: '14px', color: '#dc2626' }}>
                ⚠️ API Key Missing
              </span>
            )}
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
            showSidebar={isSidebarVisible}
          />
        </div>
      </main>

      {/* AI Input - floats at bottom of screen */}
      <AIInput
        onGenerate={generate}
        isGenerating={isGenerating}
        error={aiError}
      />
    </div>
  );
}

export default App;
