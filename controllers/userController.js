const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const STATIC_SALT =
  "oeiypafp98470n9%mus0v93uzp0943%@ZWXE$*MSV$VNIXCI$usdkyfoiwuebyniuhniugu"; // Use a fixed salt
const hashPassword = (password) => {
  return crypto
    .createHmac("sha256", STATIC_SALT)
    .update(password)
    .digest("hex");
};

// Password verification function
const verifyPassword = (inputPassword, storedHash) => {
//   console.log("hashPassword(inputPassword)", hashPassword(inputPassword));
//   console.log("storedHash", storedHash);
  return hashPassword(inputPassword) === storedHash;
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "tsinat@gmail.com" });

    if (adminExists) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = hashPassword("admin123tsi@#");

    // console.log("=== hashedPassword ===", hashedPassword);
    const admin = new User({
      name: "Tsinat admin",
      email: "tsinat@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

// Run the function
seedAdmin();

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("password", password);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Use verifyPassword to check if passwords match
    if (!verifyPassword(password, user.password)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
