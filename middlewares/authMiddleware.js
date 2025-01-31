const jwt = require("jsonwebtoken");

// Middleware to verify token
exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }
};

// Middleware to check admin role
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};
