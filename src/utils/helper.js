const bcrypt = require("bcrypt");
const { AppDataSource } = require("../database/db");
const { auth } = require("../Middleware/auth.middleware");

// Get TypeORM repository
function getRepo(entity) {
  return AppDataSource.getRepository(entity);
}

// Check if user is authenticated
function checkAuth(context) {
  if (!context.user) {
    throw new Error("Unauthorized");
  }
}

// Check if user is accessing their own data
function checkOwnership(contextUser, targetId) {
  if (String(contextUser.id) !== String(targetId)) {
    throw new Error("Forbidden: You can only access your own data");
  }
}

// Check if user is verified via OTP
function checkVerified(user) {
  if (!user || !user.isverified) {
    throw new Error("User is not verified. Please verify your email via OTP.");
  }
}

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

// Generate JWT token
function generateToken(user) {
  return auth({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.roles[0]?.name,
    contact: user.contact,
  });
}

// Format user response with role names
function formatUserWithRoles(user) {
  return {
    ...user,
    role_names: user.roles?.map((role) => role.name) || [],
  };
}

module.exports = {
  getRepo,
  checkAuth,
  checkOwnership,
  checkVerified,
  hashPassword,
  comparePassword,
  generateToken,
  formatUserWithRoles,
};
