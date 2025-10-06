const mongoose = require("mongoose");

const connectDB = async () => {
  //   try {
  await mongoose.connect(
    "mongodb+srv://itsmesamsulalom:Mongodb2025@cluster0.3c7q9um.mongodb.net/devFinder"
  );
  // console.log("DB connection successful");
  //   } catch (error) {
  //     console.log("Failed to connect DB", error);
  //   }
};

module.exports = { connectDB };
