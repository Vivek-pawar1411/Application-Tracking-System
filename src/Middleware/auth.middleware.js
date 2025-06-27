// Description: Middleware for handling authentication using JWT
// This module provides functions to generate JWT tokens and extract user information from them.

const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../database/db");
const SECRET_KEY = process.env.SECRET_KEY || "superkey";

// Get Token repo on demand
function getTokenRepo() {
  return AppDataSource.getRepository("Token");
}

// ✅ Generates a JWT token for the user
function auth(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    SECRET_KEY,
    { expiresIn: "8h" }
  );
}

// // ✅ Verifies the token and checks blacklist from DB
// async function getUserFromToken(authHeader) {
//   if (!authHeader) {
//     return null;
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     console.log("❌ Token missing in header");
//     return null;
//   }

//   try {
//     const payload = jwt.verify(token, SECRET_KEY);

//     // 🔐 Check if the token is blacklisted in DB
//     const tokenRepo = getTokenRepo();
//     const tokenEntry = await tokenRepo.findOne({ where: { token } });

//     if (!tokenEntry) {
//       console.log("❌ Token not found in DB");
//       return null;
//     }

//     if (tokenEntry.isBlacklisted) {
//       console.log("⛔ Token is blacklisted");
//       return null;
//     }

//     const now = new Date();
//     if (tokenEntry.expiresAt && now > tokenEntry.expiresAt) {
//       console.log("⏳ Token is expired (manually checked)");
//       return null;
//     }

//     console.log("✅ Token verified and valid:", payload);
//     return payload;
//   } catch (err) {
//     console.log("❌ Token verification failed:", err.message);
//     return null;
//   }
// }

async function getUserFromToken(authHeader) {
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  console.log("🔍 Extracted token:", token);
  if (!token) {
    console.log("❌ Token missing in header");
    return null;
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    // 🔐 Check if the token is blacklisted or expired
    const tokenRepo = getTokenRepo();
    const tokenEntry = await tokenRepo.findOne({ where: { token } });

    if (!tokenEntry) {
      console.log("❌ Token not found in DB");
      return null;
    }

    if (tokenEntry.isBlacklisted) {
      console.log("⛔ Token is blacklisted");
      return null;
    }

    const now = new Date();
    if (tokenEntry.expiresAt && now > tokenEntry.expiresAt) {
      console.log("⏳ Token is expired (manually checked)");
      return null;
    }

    // ✅ Fetch the full user with roles from DB
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({
      where: { id: payload.id },
      relations: ["roles"], // fetch user.roles as expected by checkAccessByRole()
    });

    if (!user) {
      console.log("❌ User not found in DB");
      return null;
    }

    console.log("✅ User loaded with roles:", user);
    return user;
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return null;
  }
}


module.exports = { auth, getUserFromToken };