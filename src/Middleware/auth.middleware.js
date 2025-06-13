// Description: Middleware for handling authentication using JWT
// This module provides functions to generate JWT tokens and extract user information from them.
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'superkey'


// Description: This function generates a JWT token for the user.
// It includes user ID, email, name, and role in the token payload.
function auth(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
}
// Description: This function extracts user information from the JWT token in the Authorization header.
// It verifies the token and returns the user object if valid, or null if invalid or missing.
function getUserFromToken(authHeader) {

  if (!authHeader) {
    // console.log("❌ No auth header");
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log("❌ Token missing in header");
    return null;
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token verified, user:",user);


    return user;
  } catch (err) {
    //console.log("❌ Token verification failed:", err.message);
    return null;
  }
}


module.exports = { auth, getUserFromToken };