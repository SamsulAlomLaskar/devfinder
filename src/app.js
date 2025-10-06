const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { connectDB } = require("./config/db.config");
const { validateSignUpData } = require("./utils/validation");

const app = express();

const PORT = 2000;

// Middleware
app.use(express.json());
app.use(cookieParser());
// store user
app.post("/signup", async (req, res) => {
  try {
    // data validation
    validateSignUpData(req);

    // password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // creating instance of User model
    const newUser = new User({
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

// Login user

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userDetail = await User.findOne({ emailId });

    if (!userDetail) {
      throw new Error("Email is not present in the DB");
    }

    const isValidPassword = await bcrypt.compare(password, userDetail.password);

    if (isValidPassword) {
      // create a JWT

      const token = await jwt.sign({ _id: userDetail._id }, "DEVFINDER", {
        expiresIn: "5m",
      });
      res.cookie("token", token);
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

// get profile
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    // Validate token
    const tokenDetails = await jwt.verify(token, "DEVFINDER");

    const logedInUser = await User.findById(tokenDetails._id);
    if (!logedInUser) {
      throw new Error("User not found, please log in with valid credentials");
    }

    res.send({ message: "Profile fetched", success: true, data: logedInUser });
  } catch (error) {
    console.log("Error Occurred : ", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

// get user by email
app.get("/user", async (req, res) => {
  try {
    console.log("COOKIE---> ", req.cookies);

    const user = await User.findOne({ emailId: req.body.emailId });
    if (user) {
      res.status(200).send({
        message: "User data saved successfully",
        data: user,
        success: true,
      });
    }
  } catch (error) {
    console.log("Failed to get the user details", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

// delete a user
app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ emailId: req.body.emailId });
    if (deletedUser > 0) {
      res.status(200).send({
        message: "User deleted successfully",
        success: true,
      });
    } else {
      res.status(404).send({
        message: "No user found",
        success: false,
      });
    }
  } catch (error) {
    console.log("Failed to delete the user details", error);

    res.status(400).json({
      message: error.message || "Unknown error occurred",
      success: false,
    });
  }
});

// Get User
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

// update user data
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const body = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: body },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).send({
        message: "User updated successfully",
        success: true,
        data: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

// DB & Server connection
connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect DB", error);
  });

app.use((req, res) => {
  res.send("Hello World");
});
