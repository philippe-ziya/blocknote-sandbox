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
  const [initialContent, setInitialContent] = useState(undefined);

  // Track whether we've finished loading from localStorage
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load saved content from localStorage on component mount
   */
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(STORAGE_KEY);
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        setInitialContent(parsed);
        console.log('Loaded saved content from localStorage:', parsed);
      } else {
        setInitialContent(undefined);
        console.log('No saved content found, starting fresh');
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
      // If there's an error, we'll just start with empty content
      setInitialContent(undefined);
    } finally {
      setIsLoaded(true);
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

  /**
   * Clear all saved content and refresh the page
   */
  const handleClearContent = () => {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Content cleared from localStorage');
      // Reload the page to start fresh
      window.location.reload();
    }
  };

  // Don't render the editor until we've loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>BlockNote Sandbox</h1>
          <p className="subtitle">Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>BlockNote Sandbox</h1>
            <p className="subtitle">
              A minimal, stable environment for experimenting with BlockNote
            </p>
          </div>
          <button onClick={handleClearContent} className="clear-button">
            Clear All Content
          </button>
        </div>
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
