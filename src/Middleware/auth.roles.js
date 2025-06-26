const Roles = {
  Master_Admin: "MasterAdmin",
  Super_Admin: "SuperAdmin",
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

  // Normalize roles (lowercase, remove underscores/spaces)
  const normalize = (role) => role.toString().toLowerCase().replace(/[_\s]/g, '');

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const userRoleNormalized = userRoles.map(normalize);
  const allowedNormalized = allowedRoles.map(normalize);

  const hasAccess = allowedNormalized.some((r) => userRoleNormalized.includes(r));

  if (!hasAccess) {
    throw new Error(`${user.role} is not authorized to perform this action`);
  }
}

module.exports = {
  Roles,
  checkAccessByRole,
};
