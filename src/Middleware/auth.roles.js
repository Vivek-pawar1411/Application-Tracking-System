const Roles = {
  Master_Admin: "Master Admin",
  Super_Admin: "Super Admin",
  HR: "Hr",
  INTERVIEWER: "Interviewer",
  CANDIDATE: "Candidate",
};

/**
 * Checks if the user has one of the allowed roles.
 *
 * @param {Object} user - The user object containing roles.
 * @param {Array<string>} allowedRoles - List of roles allowed to perform the action.
 */
function checkAccessByRole(user, allowedRoles = []) {
  if (!user || !user.role) {
    throw new Error("Unauthorized: No user or role found");
  }

  // Normalize both user role(s) and allowed roles
  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const userRoleNormalized = userRoles.map((r) => r.toLowerCase());
  const allowedNormalized = allowedRoles.map((r) => r.toLowerCase());

  const hasAccess = allowedNormalized.some((r) => userRoleNormalized.includes(r));

  if (!hasAccess) {
    throw new Error(`${user.role} is not authorized to perform this action`);
  }
}

module.exports = {
  Roles,
  checkAccessByRole,
};
