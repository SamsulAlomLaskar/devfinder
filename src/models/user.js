const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 15,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid Email address: " + email);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(pass) {
        if (!validator.isStrongPassword(pass)) {
          throw new Error("Enter a strong password!");
        }
      },
    },
    age: {
      type: Number,
      min: 20,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      validate(gender) {
        if (!["male", "female", "other"].includes(gender)) {
          throw new Error("Invalid Gender");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVFINDER", {
    expiresIn: "5m",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const user = this;
  const isValidPassword = await bcrypt.compare(userPassword, user.password);

  return isValidPassword;
};

// const userModel = mongoose.model("User", userSchema);

// module.exports = userModel;
module.exports = mongoose.model("User", userSchema);
