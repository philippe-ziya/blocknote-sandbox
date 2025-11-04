/**
 * Core Type Definitions for BlockNote Sandbox
 *
 * This file contains all the shared types used throughout the application.
 */

import type * as Y from 'yjs';
import type { BlockNoteEditor } from '@blocknote/core';
import type { YjsThreadStore } from '@blocknote/core/comments';

/**
 * User role types
 * - editor: Can create, edit, and delete comments
 * - comment: Can only create comments
 */
export type UserRole = 'editor' | 'comment';

/**
 * User object structure
 */
export interface User {
  id: string;
  username: string;
  color: string;
  role: UserRole;
}

/**
 * Return type for the Yjs document creation
 */
export interface YjsDocumentResult {
  doc: Y.Doc;
  persistence: any; // IndexeddbPersistence type
}

/**
 * Props for the UserSelector component
 */
export interface UserSelectorProps {
  currentUser: User;
  onUserChange: (user: User) => void;
}

/**
 * Props for the CommentsSidebar component
 */
export interface CommentsSidebarProps {
  editor: BlockNoteEditor | null;
}

/**
 * Props for the Editor component
 */
export interface EditorProps {
  yjsDoc: Y.Doc;
  threadStore: YjsThreadStore;
  resolveUsers: (userIds: string[]) => Promise<User[]>;
  currentUser: User;
  onEditorReady?: (editor: BlockNoteEditor) => void;
  showSidebar: boolean;
}

/**
 * Return type for the useComments hook
 */
export interface UseCommentsReturn {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  yjsDoc: Y.Doc | null;
  threadStore: YjsThreadStore | null;
  resolveUsers: (userIds: string[]) => Promise<User[]>;
  isLoading: boolean;
}

/**
 * BlockNote block structure
 * Simplified type for blocks that will be inserted into the editor
 */
export interface BlockNoteBlock {
  type: string;
  props?: Record<string, any>;
  content?: string | any[];
  children?: BlockNoteBlock[];
}

/**
 * Editor state context for AI generation
 */
export interface EditorState {
  selectedText: string;
  selectedBlocks: any[];
  allBlocks: any[];
  cursorPosition: number;
}

/**
 * AI generation history item
 */
export interface AIGeneration {
  input: string;
  output: string;
  blocks: BlockNoteBlock[];
  timestamp: number;
}

/**
 * Return type for useAIGeneration hook
 */
export interface UseAIGenerationReturn {
  generate: (userInput: string) => Promise<BlockNoteBlock[] | undefined>;
  isGenerating: boolean;
  error: string | null;
  lastGeneration: AIGeneration | null;
}

/**
 * Props for AIInput component
 */
export interface AIInputProps {
  onGenerate: (userInput: string) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
}
