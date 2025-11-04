/**
 * useAIGeneration Hook
 *
 * Manages all AI generation logic:
 * - Calls OpenAI API
 * - Handles loading and error states
 * - Converts AI text to BlockNote blocks
 * - Inserts blocks into editor at cursor position
 * - Tracks generation history
 *
 * Usage:
 *   const { generate, isGenerating, error } = useAIGeneration(editor);
 *   await generate("Write a project plan");
 */

import { useState } from 'react';
import type { BlockNoteEditor } from '@blocknote/core';
import { openai } from '../lib/openai';
import { buildPrompt } from '../lib/prompt-templates';
import { parseToBlocks, validateBlocks } from '../lib/block-generator';
import type { UseAIGenerationReturn, EditorState, BlockNoteBlock, AIGeneration } from '../types';

export function useAIGeneration(editor: BlockNoteEditor | null): UseAIGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneration, setLastGeneration] = useState<AIGeneration | null>(null);

  /**
   * Generate content from user input
   */
  const generate = async (userInput: string): Promise<BlockNoteBlock[] | undefined> => {
    // Validation
    if (!userInput.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!editor) {
      setError('Editor not ready');
      return;
    }

    // Reset state
    setIsGenerating(true);
    setError(null);

    try {
      console.log('🤖 Generating content for:', userInput);

      // Check if OpenAI is available
      if (!openai) {
        throw new Error('OpenAI not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      // Get editor context for smart prompting
      const editorState = getEditorState(editor);

      // Build context-aware prompt
      const prompt = buildPrompt(userInput, editorState);
      console.log('📝 Prompt built:', prompt.substring(0, 100) + '...');

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast and cost-effective
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7, // Balanced creativity
        max_tokens: 1000 // Reasonable length
      });

      // Extract generated text
      const generatedText = response.choices[0]?.message.content;

      if (!generatedText) {
        throw new Error('No content generated');
      }

      console.log('✅ Generated text:', generatedText);

      // Convert markdown to BlockNote blocks
      const blocks = parseToBlocks(generatedText);
      const validBlocks = validateBlocks(blocks);

      if (validBlocks.length === 0) {
        throw new Error('No valid content generated');
      }

      console.log('📦 Created blocks:', validBlocks.length);

      // Insert blocks at cursor position
      insertBlocksAtCursor(editor, validBlocks);

      // Save generation history
      setLastGeneration({
        input: userInput,
        output: generatedText,
        blocks: validBlocks,
        timestamp: Date.now()
      });

      console.log('🎉 Content inserted successfully');
      return validBlocks;

    } catch (err: any) {
      console.error('❌ AI generation error:', err);

      // User-friendly error messages
      let errorMessage = 'Failed to generate content';

      if (err.message?.includes('API key')) {
        errorMessage = 'OpenAI API key not configured';
      } else if (err.message?.includes('quota')) {
        errorMessage = 'API quota exceeded - check your OpenAI account';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error - check your connection';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;

    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Get current editor state for context-aware prompting
   */
  const getEditorState = (editor: BlockNoteEditor): EditorState => {
    try {
      const selection = editor.getSelection();
      const selectedBlocks = selection ? editor.getSelectedBlocks() : [];
      const allBlocks = editor.document;

      return {
        selectedText: selectedBlocks.map(b => b.content).join('\n'),
        selectedBlocks,
        allBlocks,
        cursorPosition: selection?.to?.block || 0
      };
    } catch (err) {
      console.warn('Could not get editor state:', err);
      return {
        selectedText: '',
        selectedBlocks: [],
        allBlocks: [],
        cursorPosition: 0
      };
    }
  };

  /**
   * Insert blocks at current cursor position
   */
  const insertBlocksAtCursor = (editor: BlockNoteEditor, blocks: BlockNoteBlock[]) => {
    try {
      // Get current text cursor position
      const textCursorPosition = editor.getTextCursorPosition();

      if (textCursorPosition && textCursorPosition.block) {
        // Insert after the block where cursor is
        editor.insertBlocks(blocks as any, textCursorPosition.block.id, 'after');
        console.log('📍 Inserted after cursor block:', textCursorPosition.block.id);
      } else {
        // Fallback: append to end of document
        const allBlocks = editor.document;
        if (allBlocks.length > 0) {
          const lastBlock = allBlocks[allBlocks.length - 1];
          if (lastBlock && lastBlock.id) {
            editor.insertBlocks(blocks as any, lastBlock.id, 'after');
            console.log('📍 Inserted after last block');
          } else {
            editor.insertBlocks(blocks as any);
            console.log('📍 Appended to end (fallback)');
          }
        } else {
          // Empty editor - just insert
          editor.insertBlocks(blocks as any);
          console.log('📍 Inserted into empty editor');
        }
      }
    } catch (err) {
      console.error('Failed to insert blocks:', err);
      throw new Error('Failed to insert content into editor');
    }
  };

  return {
    generate,
    isGenerating,
    error,
    lastGeneration
  };
}
