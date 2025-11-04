/**
 * OpenAI API Client Configuration
 *
 * This file initializes the OpenAI client with the API key from environment variables.
 *
 * SECURITY NOTE:
 * - dangerouslyAllowBrowser: true means the API key is exposed in the browser
 * - This is ACCEPTABLE for prototyping and personal testing
 * - NOT suitable for production - use a backend proxy instead
 * - Set usage limits in OpenAI dashboard to prevent abuse
 *
 * To use:
 * 1. Get API key from https://platform.openai.com/api-keys
 * 2. Add to .env.local: VITE_OPENAI_API_KEY=sk-your-key-here
 * 3. Restart dev server
 */

import OpenAI from 'openai';

// Get API key from environment (check multiple possible names)
const getApiKey = (): string | undefined => {
  // Check VITE_ prefixed version (required for Vite to expose to client)
  const viteKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (viteKey) return viteKey;

  // Fallback: check without prefix (in case user added it this way)
  // Note: This won't work in Vite unless explicitly configured
  const directKey = import.meta.env.OPENAI_API_KEY;
  if (directKey) return directKey;

  return undefined;
};

// Check if API key is configured
export const isOpenAIConfigured = (): boolean => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.log('ℹ️ No OpenAI API key found. Checked: VITE_OPENAI_API_KEY, OPENAI_API_KEY');
    return false;
  }

  if (apiKey === 'your-api-key-goes-here') {
    console.warn('⚠️ OpenAI API key is placeholder value');
    return false;
  }

  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️ OpenAI API key does not start with sk-');
    return false;
  }

  console.log('✅ OpenAI API key configured');
  return true;
};

// Get OpenAI client instance (returns null if not configured)
export const getOpenAIClient = (): OpenAI | null => {
  const apiKey = getApiKey();

  if (!isOpenAIConfigured()) {
    console.warn('⚠️ OpenAI not configured. AI features will be disabled.');
    console.log('💡 Add VITE_OPENAI_API_KEY to your .env.local or deployment environment');
    return null;
  }

  try {
    const client = new OpenAI({
      apiKey: apiKey!,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
    console.log('✅ OpenAI client initialized successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error);
    return null;
  }
};

// Export client instance (may be null if not configured)
export const openai = getOpenAIClient();
