const express = require("express");
const { connectDB } = require("./config/db.config");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();

const PORT = 2000;

// Middleware
app.use(express.json());

// store user
app.post("/signup", async (req, res) => {
  // data validation
  validateSignUpData(req);

  // creating instance of User model
  const newUser = new User(req.body);

  try {
    const isEMailExist = await User.findOne({ emailId: newUser.emailId });
    if (!isEMailExist) {
      await newUser.save();
      res.status(200).json({
        message: "User data saved successfully",
        data: newUser,
        success: true,
      });
    }
    throw new Error("The email already exists, please change the email");
  } catch (error) {
    console.log("Failed to save the user details", error);

    res.status(400).json({
      message: error.message,
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
