const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the request cookies
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token, please login again");
    }

    // validate the token
    const authDetails = await jwt.verify(token, "DEVFINDER");

    const { _id } = authDetails;

    // Find the user
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error Occurred : ", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
};

module.exports = { userAuth };
