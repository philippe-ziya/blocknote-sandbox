/**
 * User Selector Component
 *
 * Dropdown menu to switch between test users.
 * This lets you simulate different users to test:
 * - Multi-user commenting
 * - Different roles (editor vs comment-only)
 * - User permissions
 *
 * Props:
 * - currentUser: The currently selected user object
 * - onUserChange: Callback when user is changed
 */

import { MOCK_USERS, setCurrentUser as saveCurrentUser } from '../lib/users';

export function UserSelector({ currentUser, onUserChange }) {
  /**
   * Handle user change
   * Saves the new user to localStorage and reloads the page
   *
   * Why reload?
   * - The editor needs to reinitialize with the new user's permissions
   * - This is the simplest approach for a prototype
   * - Production apps would handle this more gracefully
   */
  const handleUserChange = (userId) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      // Save to localStorage
      saveCurrentUser(userId);

      // Update parent state
      onUserChange(user);

      // Reload page to reinitialize editor with new user
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
