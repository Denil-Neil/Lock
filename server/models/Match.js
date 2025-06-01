const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "matched", "unmatched"],
      default: "pending",
    },
    matchedAt: {
      type: Date,
      default: Date.now,
    },
    lastMessageAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique matches (prevent duplicate matches)
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Method to check if two users are matched
matchSchema.statics.areMatched = async function (userId1, userId2) {
  const match = await this.findOne({
    $or: [
      { user1: userId1, user2: userId2, status: "matched" },
      { user1: userId2, user2: userId1, status: "matched" },
    ],
  });
  return !!match;
};

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
