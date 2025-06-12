// This module defines user roles and a function to check if a user has admin access.

// Description: This module defines user roles and a function to check if a user has admin access.
const Roles = {
  ADMIN: 'Admin',
  HR: 'Hr',
  INTERVIEWER: 'Interviewer',
  CANDIDATE: 'Candidate',
};

/**
 * Middleware-like function to check if user is admin.
 * Throws error if user is not admin.
 * 
 * @param {Object} user - user object with a 'role' property
 */

// Description: This module defines user roles and a function to check if a user has admin access.
function checkAdminAccess(user) {
  if (!user) {
    throw new Error('Unauthorized: No user found');
  }
  if (user.role !== Roles.ADMIN) {
    throw new Error(`${user.role} is not authorized to perform this action`);
  }
}

module.exports = {
  Roles,
  checkAdminAccess,
};
