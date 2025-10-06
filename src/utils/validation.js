const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    return new Error("Invalid Name");
  }

  if (!validator.isEmail(emailId)) {
    return new Error("Email id is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

module.exports = { validateSignUpData };
