const Roles = {
  Master_Admin: "Master Admin",
  Super_Admin: "Super Admin",
  HR: "HR",
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
if (!user || !user.roles || user.roles.length === 0) {
    throw new Error("Unauthorized: No user or role found");
  }


   const userRoles = user.roles.map(r => r.name.toLowerCase());
  const allowedNormalized = allowedRoles.map(r => r.toLowerCase());

  const hasAccess = allowedNormalized.some(role =>
    userRoles.includes(role)
  );

  if (!hasAccess) {
    throw new Error(`${userRoles.join(", ")} is not authorized to perform this action`);
  }
}

module.exports = {
  Roles,
  checkAccessByRole,
};