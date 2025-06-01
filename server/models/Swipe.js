const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
  {
    swiper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    swiped: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "dislike", "superlike"],
      required: true,
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

// Ensure unique swipes (prevent duplicate swipes)
swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

// Method to check if there's a mutual like
swipeSchema.statics.checkMutualLike = async function (userId1, userId2) {
  const like1 = await this.findOne({
    swiper: userId1,
    swiped: userId2,
    action: { $in: ["like", "superlike"] },
  });

  const like2 = await this.findOne({
    swiper: userId2,
    swiped: userId1,
    action: { $in: ["like", "superlike"] },
  });

  return like1 && like2;
};

const Swipe = mongoose.model("Swipe", swipeSchema);

module.exports = Swipe;
