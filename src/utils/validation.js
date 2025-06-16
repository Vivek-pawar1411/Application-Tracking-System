// Validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    throw new Error("Invalid email format");
  }
}

// Validate contact number (Indian format)
function validateContact(contact) {
  const regex = /^[6-9]\d{9}$/;
  if (!contact || !regex.test(contact)) {
    throw new Error("Invalid contact number");
  }
}

// Validate password length
function validatePassword(password) {
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
}

// Validate name length
function validateName(name) {
  if (!name || name.trim().length < 3) {
    throw new Error("Name must be at least 3 characters long");
  }
}

module.exports = {
  validateEmail,
  validateContact,
  validatePassword,
  validateName,
};
