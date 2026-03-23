const express = require("express");
const User = require("../models/user");

const authRouter = express.Router();

// Login user
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailId
 *               - password
 *             properties:
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in cookie
 *             schema:
 *               type: string
 *       404:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request
 */
authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      const userDetail = await User.findOne({ emailId });
  
      if (!userDetail) {
        throw new Error("Email is not present in the DB");
      }
  
      const isValidPassword = await userDetail.validatePassword(
        password,
        userDetail
      );
  
      if (isValidPassword) {
        // create a JWT
  
        const token = await userDetail.getJWT();
  
        res.cookie("token", token, {
          // maxAge or the expires works the same
          expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.status(200).send("Login Successful");
      } else {
        res.status(404).send("Invalid credentials");
      }
    } catch (error) {
      console.log("Error Occurred : ", error);
  
      res.status(400).json({
        message: error.message || "Unknown error occurred",
        success: false,
      });
    }
  });

  // logout user
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 */
authRouter.post("/logout", async (req, res) => {
  try {
    // res.clearCookie("token").status(200).send({
    //   message: "Logout successful",
    //   success: true,
    // });

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    }).send("Logout successful!!")

  } catch (error) {
    console.log("Error Occurred : ", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
})


  // store user
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Store user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 */
authRouter.post("/signup", async (req, res) => {
    try {
      // data validation
      validateSignUpData(req);
  
      // password encryption
      const { firstName, lastName, emailId, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
  
      // creating instance of User model
      const newUser = new user({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
      const isEMailExist = await User.findOne({ emailId: newUser.emailId });
      if (isEMailExist) {
        throw new Error("The email already exists, please change the email");
      }
      await newUser.save();
      res.status(200).json({
        message: "User data saved successfully",
        data: newUser,
        success: true,
      });
    } catch (error) {
      console.log("Failed to save the user details", error);
  
      res.status(400).json({
        message: error.message || "Unknown error occurred",
        success: false,
      });
    }
  });

  module.exports = authRouter;