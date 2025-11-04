/**
 * UserSelector Component
 *
 * Dropdown for switching between different test users.
 * This allows testing comment permissions and multi-user scenarios.
 *
 * When a user is selected:
 * - Updates the current user in App state
 * - Saves user ID to localStorage
 * - Reloads the page to reinitialize editor with new user context
 */

import { MOCK_USERS, setCurrentUser as saveCurrentUser } from '../lib/users';
import type { UserSelectorProps } from '../types';

export function UserSelector({ currentUser, onUserChange }: UserSelectorProps) {
  const handleUserChange = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      saveCurrentUser(userId);
      onUserChange(user);
      console.log('🔄 Switching to user:', user.username);
      window.location.reload();
    }
  };

  return (
    <div className="user-selector">
      <label htmlFor="user-select">Current User:</label>
      <select
        id="user-select"
        value={currentUser.id}
        onChange={(e) => handleUserChange(e.target.value)}
      >
        {MOCK_USERS.map(user => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.role})
          </option>
        ))}
      </select>
    </div>
  );
}
