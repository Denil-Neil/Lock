const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Match = require("../models/Match");
const Swipe = require("../models/Swipe");
const Message = require("../models/Message");

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear all collections
    await User.deleteMany({});
    console.log("✅ Cleared all users");

    await Match.deleteMany({});
    console.log("✅ Cleared all matches");

    await Swipe.deleteMany({});
    console.log("✅ Cleared all swipes");

    await Message.deleteMany({});
    console.log("✅ Cleared all messages");

    console.log("🎉 Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
};

clearDatabase();
