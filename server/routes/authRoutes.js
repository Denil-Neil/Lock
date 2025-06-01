const express = require("express");
const router = express.Router();
const passport = require("passport");

// Test route to verify the auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

// Google OAuth routes
router.get(
  "/google",
  (req, res, next) => {
    console.log("Google auth route hit");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback route hit");
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
      session: true,
    })(req, res, next);
  },
  (req, res) => {
    // Check if user profile is complete
    const user = req.user;
    const isProfileComplete =
      user.college && user.major && user.age && user.gender;

    if (!isProfileComplete) {
      // Redirect to profile completion page
      res.redirect("http://localhost:3000/complete-profile");
    } else {
      // Redirect to dashboard
      res.redirect("http://localhost:3000");
    }
  }
);

// Get current user
router.get("/current-user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction failed" });
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
