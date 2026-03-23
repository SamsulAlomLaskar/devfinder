const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const { connectDB } = require("./config/db.config");
const { validateSignUpData, validateProfileEditData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");

const app = express();

const PORT = 2000;

// Request timeout middleware (30 seconds default)
const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(408).json({
          message: "Request timeout - the server did not receive a complete request in time",
          success: false,
        });
      }
    });

    // Set response timeout
    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({
          message: "Gateway timeout - the server did not respond in time",
          success: false,
        });
      }
    });

    next();
  };
};4

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(requestTimeout(30000)); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/", profileRouter);
app.use("/api/", authRouter);

// send connection request
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  console.log("Sending a connection request");

  res.send("Connection request sent");
});

// get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (user) {
      res.status(200).send({
        message: "User data fetched successfully",
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
