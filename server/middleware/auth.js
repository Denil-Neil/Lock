const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Check if user is authenticated via session (Google OAuth)
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      // User is authenticated via session
      return next();
    }

    // Fallback to JWT token authentication for backwards compatibility
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        return next();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }
    }

    // No valid authentication found
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    return res.status(401).json({ message: "Authentication error" });
  }
};

const verifyCollegeEmail = (req, res, next) => {
  const email = req.body.email;
  const collegeDomains = [
    ".edu",
    // Add more college domains as needed
  ];

  const isValidCollegeEmail = collegeDomains.some((domain) =>
    email.endsWith(domain)
  );

  if (!isValidCollegeEmail) {
    return res
      .status(400)
      .json({ message: "Please use your college email address" });
  }

  next();
};

module.exports = { protect, verifyCollegeEmail };
