const Roles = {
  ADMIN: 'admin',
  HR: 'hr',
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate',
};

/**
 * Middleware-like function to check if user is admin.
 * Throws error if user is not admin.
 * 
 * @param {Object} user - user object with a 'role' property
 */
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
