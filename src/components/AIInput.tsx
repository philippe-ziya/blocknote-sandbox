/**
 * AIInput Component
 *
 * Floating input at the bottom of the editor where users type what they want to write.
 * Features:
 * - Keyboard shortcut: Cmd/Ctrl+K to focus
 * - Enter to generate
 * - Shift+Enter for new line
 * - Escape to blur
 * - Loading states
 * - Error display
 *
 * Usage:
 *   <AIInput onGenerate={generate} isGenerating={false} error={null} />
 */

import { useState, useRef, useEffect } from 'react';
import type { AIInputProps } from '../types';
import './AIInput.css';

export function AIInput({ onGenerate, isGenerating, error }: AIInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (input.trim() && !isGenerating) {
      await onGenerate(input);
      setInput(''); // Clear input after successful generation
    }
  };

  /**
   * Handle keyboard shortcuts in input
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to submit (Shift+Enter for new line - not applicable to input, but documented)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }

    // Escape to blur
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  /**
   * Global keyboard shortcut: Cmd/Ctrl + K to focus input
   */
  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, []);

  return (
    <div className={`ai-input-container ${isFocused ? 'ai-input-focused' : ''}`}>
      {/* Header - only shown when focused */}
      {isFocused && (
        <div className="ai-input-header">
          <div className="ai-input-header-badge">
            <span className="ai-input-header-icon">✏️</span>
            <span className="ai-input-header-text">Review my response</span>
          </div>
        </div>
      )}

      <div className="ai-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="ai-input-field"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            // Delay blur to allow button clicks
            setTimeout(() => setIsFocused(false), 150);
          }}
          disabled={isGenerating}
        />

        {/* Send button - only shown when NOT focused */}
        {!isFocused && (
          <button
            className="ai-generate-button"
            onClick={handleSubmit}
            disabled={!input.trim() || isGenerating}
            title="Generate (Enter)"
          >
            {isGenerating ? '⏳' : '▶'}
          </button>
        )}
      </div>

      {/* Controls - only shown when focused */}
      {isFocused && (
        <div className="ai-input-controls">
          <div className="ai-control-buttons-group">
            <button className="ai-control-button">
              <span className="ai-control-icon">+</span>
              <span className="ai-control-text">Context</span>
            </button>
            <button className="ai-control-button">
              <span className="ai-control-icon">⚙️</span>
              <span className="ai-control-text">Settings</span>
            </button>
          </div>

          {/* Send button - moved here when focused */}
          <button
            className="ai-generate-button ai-generate-button-focused"
            onClick={handleSubmit}
            disabled={!input.trim() || isGenerating}
            title="Generate (Enter)"
          >
            {isGenerating ? '⏳' : '▶'}
          </button>
        </div>
      )}

      {error && (
        <div className="ai-input-error">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
