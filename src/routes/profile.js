const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const profileRouter = express.Router();

// get profile
/**
 * @swagger
 * /profile/view:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile fetched
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send({ message: "Profile fetched", success: true, data: req.user });
  } catch (error) {
    console.log("Error Occurred : ", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

/**
 * @swagger
 * /profile/edit:
 *   patch:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 */
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit fields");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      success: true,
      data: loggedInUser,
    });
  } catch (error) {
    console.log("Error Occurred : ", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

/**
 * @swagger
 * /profile/password:
 *   patch:
 *     summary: Update user password
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    console.log("req.body", req.body);
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    const userDetail = await User.findOne({ emailId: loggedInUser.emailId });

    const isValidOldPassword = await bcrypt.compare(oldPassword, userDetail.password);

    if (!isValidOldPassword) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await validatePasswordUpdate(newPassword);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

module.exports = profileRouter;
