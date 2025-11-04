/**
 * Block Generator
 *
 * Converts AI-generated markdown text into BlockNote block structures.
 * BlockNote blocks are JSON objects that represent editor content.
 *
 * Supported formats:
 * - Headings: # H1, ## H2, ### H3
 * - Bullet lists: - item or * item
 * - Numbered lists: 1. item, 2. item
 * - Paragraphs: regular text
 *
 * Example input (markdown):
 *   # Project Plan
 *   ## Overview
 *   This is a paragraph.
 *   - First point
 *   - Second point
 *
 * Example output (BlockNote blocks):
 *   [
 *     { type: "heading", props: { level: 1 }, content: "Project Plan" },
 *     { type: "heading", props: { level: 2 }, content: "Overview" },
 *     { type: "paragraph", content: "This is a paragraph." },
 *     { type: "bulletListItem", content: "First point" },
 *     { type: "bulletListItem", content: "Second point" }
 *   ]
 */

import type { BlockNoteBlock } from '../types';

/**
 * Parse AI-generated markdown text into BlockNote blocks
 */
export function parseToBlocks(text: string): BlockNoteBlock[] {
  const lines = text.split('\n');
  const blocks: BlockNoteBlock[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    // Skip empty lines
    if (!line) continue;

    // Heading level 1: # Title
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading',
        props: { level: 1 },
        content: line.substring(2).trim()
      });
      continue;
    }

    // Heading level 2: ## Subtitle
    if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading',
        props: { level: 2 },
        content: line.substring(3).trim()
      });
      continue;
    }

    // Heading level 3: ### Subheading
    if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading',
        props: { level: 3 },
        content: line.substring(4).trim()
      });
      continue;
    }

    // Bullet list: - Item or * Item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        type: 'bulletListItem',
        content: line.substring(2).trim()
      });
      continue;
    }

    // Numbered list: 1. Item, 2. Item, etc.
    if (/^\d+\.\s/.test(line)) {
      blocks.push({
        type: 'numberedListItem',
        content: line.replace(/^\d+\.\s/, '').trim()
      });
      continue;
    }

    // Default: paragraph
    blocks.push({
      type: 'paragraph',
      content: line
    });
  }

  return blocks;
}

/**
 * Validate blocks before insertion
 * Ensures all blocks have required fields
 */
export function validateBlocks(blocks: BlockNoteBlock[]): BlockNoteBlock[] {
  return blocks.filter(block => {
    // Must have a type
    if (!block.type) return false;

    // Must have content (string or array)
    if (!block.content) return false;

    return true;
  });
}

/**
 * Convert BlockNote blocks back to readable text
 * Useful for debugging and context building
 */
export function blocksToText(blocks: any[]): string {
  return blocks
    .map(block => {
      if (typeof block.content === 'string') {
        return block.content;
      }
      if (Array.isArray(block.content)) {
        return block.content
          .map((item: any) => item.text || '')
          .join('');
      }
      return '';
    })
    .filter(text => text.length > 0)
    .join('\n\n');
}
