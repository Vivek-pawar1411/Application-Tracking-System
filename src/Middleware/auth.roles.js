// This module defines user roles and a function to check if a user has admin access.

// Description: This module defines user roles and a function to check if a user has admin access.
const Roles = {
  ADMIN: 'Admin',
  HR: 'Hr',
  INTERVIEWER: 'Interviewer',
  CANDIDATE: 'Candidate',
};


/**
 * Function to check if the user has one of the allowed roles
 * 
 * @param {Object} user - User object that includes a 'role' property
 * @param {Array<string>} allowedRoles - List of roles that have access
 */

// Description: This module defines user roles and a function to check if a user has admin access.
function checkAccessByRole(user, allowedRoles = []) {
  if (!user) {
    throw new Error('Unauthorized: No user found');
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`${user.role} is not authorized to perform this action`);
  }
}

module.exports = {
  Roles,
  checkAccessByRole,
};
