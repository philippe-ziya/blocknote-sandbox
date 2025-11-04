import { useState, useEffect } from 'react'
import Editor from './components/Editor'

// localStorage key for saving editor content
const STORAGE_KEY = 'blocknote-content';

/**
 * Main Application Component
 *
 * This is the top-level component that:
 * - Manages the editor state
 * - Handles editor content changes
 * - Provides the basic layout structure
 * - Persists content to localStorage (Phase 2)
 */
function App() {
  // Track the last saved time for user feedback
  const [lastSaved, setLastSaved] = useState(null);

  // Store initial content loaded from localStorage
  const [initialContent, setInitialContent] = useState(null);

  /**
   * Load saved content from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(STORAGE_KEY);
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        setInitialContent(parsed);
        console.log('Loaded saved content from localStorage');
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
      // If there's an error, we'll just start with empty content
    }
  }, []);

  /**
   * Called whenever the editor content changes
   * Saves the content to localStorage automatically
   * @param {Object} editor - The BlockNote editor instance
   */
  const handleEditorChange = async (editor) => {
    try {
      // Get the current content from the editor
      const content = editor.document;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));

      // Update the last saved timestamp
      setLastSaved(new Date());

      console.log('Content saved to localStorage');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>BlockNote Sandbox</h1>
        <p className="subtitle">
          A minimal, stable environment for experimenting with BlockNote
        </p>
        {lastSaved && (
          <span className="status-indicator">
            ● Auto-saved at {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </header>

      <main className="editor-container">
        <Editor
          onChange={handleEditorChange}
          initialContent={initialContent}
        />
      </main>
    </div>
  )
}

export default App
