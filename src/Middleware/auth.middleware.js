const jwt=require('jsonwebtoken');
const SECRET_KEY=process.env.SECRET_KEY || 'superkey'



function auth(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role:user.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
}
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
    console.log("✅ Token verified, user:");

    
    return user;
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return null;
  }
}


module.exports = {auth, getUserFromToken};