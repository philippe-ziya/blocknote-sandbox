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
      <div className="ai-input-wrapper">
        <div className="ai-input-icon">
          {isGenerating ? '⏳' : '✨'}
        </div>

        <input
          ref={inputRef}
          type="text"
          className="ai-input-field"
          placeholder="What do you want to write? (⌘K)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isGenerating}
        />

        <button
          className="ai-generate-button"
          onClick={handleSubmit}
          disabled={!input.trim() || isGenerating}
          title="Generate (Enter)"
        >
          {isGenerating ? 'Generating...' : '⚡'}
        </button>
      </div>

      {error && (
        <div className="ai-input-error">
          ⚠️ {error}
        </div>
      )}

      <div className="ai-input-hint">
        Press Enter to generate • Escape to dismiss • ⌘K to focus
      </div>
    </div>
  );
}
