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

// Check if API key is configured
export const isOpenAIConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!apiKey && apiKey !== 'your-api-key-goes-here' && apiKey.startsWith('sk-');
};

// Get OpenAI client instance (returns null if not configured)
export const getOpenAIClient = (): OpenAI | null => {
  if (!isOpenAIConfigured()) {
    console.warn('⚠️ OpenAI not configured. AI features will be disabled.');
    return null;
  }

  try {
    return new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error);
    return null;
  }
};

// Export client instance (may be null if not configured)
export const openai = getOpenAIClient();
