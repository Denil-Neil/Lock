const express = require("express");
const router = express.Router();
const { protect, verifyCollegeEmail } = require("../middleware/auth");
const {
  registerUser,
  verifyEmail,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.post("/", verifyCollegeEmail, registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
