/**
 * Mock Users System
 *
 * Provides test users for simulating multi-user commenting scenarios.
 * Each user has a unique ID, username, color for visual identification,
 * and a role that determines their permissions.
 */

// Mock users for testing different comment scenarios
export const MOCK_USERS = [
  {
    id: 'user-1',
    username: 'Designer',
    color: '#958DF1',
    role: 'editor' // Can create, edit, delete comments
  },
  {
    id: 'user-2',
    username: 'Developer',
    color: '#F98181',
    role: 'editor'
  },
  {
    id: 'user-3',
    username: 'Product Manager',
    color: '#70CFF8',
    role: 'editor'
  },
  {
    id: 'user-4',
    username: 'Stakeholder',
    color: '#FAF594',
    role: 'comment' // Can only add comments, not edit/delete
  }
];

/**
 * Get the current user
 * Loads from localStorage or returns the first user as default
 * @returns {Object} User object
 */
export function getCurrentUser() {
  const savedUserId = localStorage.getItem('currentUserId');
  const user = MOCK_USERS.find(u => u.id === savedUserId);
  return user || MOCK_USERS[0];
}

/**
 * Set the current user
 * Saves user ID to localStorage for persistence
 * @param {string} userId - The user ID to set as current
 */
export function setCurrentUser(userId) {
  localStorage.setItem('currentUserId', userId);
}

/**
 * Resolve user IDs to user objects
 * Required by BlockNote to display user information in comments
 * Simulates async behavior (like a real API call)
 * @param {string[]} userIds - Array of user IDs to resolve
 * @returns {Promise<Object[]>} Array of user objects
 */
export async function resolveUsers(userIds) {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 100));

  return MOCK_USERS.filter(user => userIds.includes(user.id));
}
