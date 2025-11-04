/**
 * Prompt Engineering Templates
 *
 * This file contains all the prompts sent to OpenAI.
 * Good prompts = good AI output. These templates ensure consistent,
 * well-formatted content generation.
 *
 * Key principles:
 * - Clear formatting instructions (markdown)
 * - Specific output structure
 * - Professional, concise language
 * - Context-aware (uses editor state)
 */

import type { EditorState } from '../types';
import { blocksToText } from './block-generator';

/**
 * Base system prompt - used for all AI generations
 * Teaches the AI how to format content for BlockNote
 */
export const SYSTEM_PROMPT = `You are a helpful writing assistant that generates well-structured content.

Output Format Rules:
- Use markdown formatting
- Use # for main headings (H1)
- Use ## for subheadings (H2)
- Use ### for sub-subheadings (H3)
- Use - for bullet points
- Use 1. 2. 3. for numbered lists
- Write clear, concise paragraphs
- Separate sections with blank lines

Quality Guidelines:
- Be specific and actionable
- Use clear, professional language
- Structure content logically
- Keep paragraphs concise (2-4 sentences)
- Use headings to organize content
- Make lists easy to scan`;

/**
 * Prompt templates for different use cases
 */
export const PROMPT_TEMPLATES = {
  /**
   * General content generation
   * Used when user types a fresh request
   */
  generate: (userInput: string): string => `${SYSTEM_PROMPT}

User Request: ${userInput}

Generate the requested content using markdown formatting. Be thorough but concise.`,

  /**
   * Expand on existing content
   * Used when editor has content and user wants to add more
   */
  expand: (userInput: string, context: string): string => `${SYSTEM_PROMPT}

Existing Content:
${context}

User Request: ${userInput}

Expand on the existing content based on the user's request. Continue in the same style and tone.`,

  /**
   * Rewrite/improve selected content
   * Used when user has text selected
   */
  rewrite: (userInput: string, selectedText: string): string => `${SYSTEM_PROMPT}

Original Text:
${selectedText}

User Request: ${userInput}

Rewrite or improve the original text according to the user's request. Maintain the general structure but enhance clarity and quality.`,

  /**
   * Continue writing
   * Used when user wants AI to continue from where they left off
   */
  continue: (context: string): string => `${SYSTEM_PROMPT}

Existing Content:
${context}

Continue writing naturally from where the content left off. Write 2-3 additional paragraphs that flow logically from the existing content.`
};

/**
 * Build the appropriate prompt based on editor context
 * This function decides which template to use
 */
export function buildPrompt(userInput: string, editorState: EditorState): string {
  const { selectedText, allBlocks } = editorState;

  // If text is selected, user wants to rewrite/improve it
  if (selectedText && selectedText.length > 0) {
    return PROMPT_TEMPLATES.rewrite(userInput, selectedText);
  }

  // If editor has content and user says "continue" or similar
  if (allBlocks.length > 0 && userInput.toLowerCase().includes('continue')) {
    // Get last 3 blocks for context
    const recentBlocks = allBlocks.slice(-3);
    const context = blocksToText(recentBlocks);
    return PROMPT_TEMPLATES.continue(context);
  }

  // If editor has content and user wants to expand
  if (allBlocks.length > 0 && userInput.toLowerCase().includes('more')) {
    const recentBlocks = allBlocks.slice(-3);
    const context = blocksToText(recentBlocks);
    return PROMPT_TEMPLATES.expand(userInput, context);
  }

  // Default: generate fresh content
  return PROMPT_TEMPLATES.generate(userInput);
}
