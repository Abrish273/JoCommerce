const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the upload directory
const uploadDir = path.join(__dirname, "..", "public/uploads");

// Ensure the directory exists, create if not
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store images in public/uploads
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a random number and timestamp
    const randomNumber = Math.floor(Math.random() * 100000000000); // Random number between 0 and 9999
    const timestamp = Date.now(); // Current timestamp

    // Format the timestamp into 'YYYY-MM-DD HH-MM-SS' format
    const formattedDate = new Date(timestamp)
      .toISOString()
      .replace("T", " ") // Replace 'T' with a space
      .slice(0, 19); // Remove milliseconds

    // Combine random number, timestamp, and original file name
    const newFilename = `${randomNumber}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

// File Filter to allow only image files
const fileFilter = (req, file, cb) => {
  // Define allowed image formats
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  // If file is an image, allow it, otherwise throw error
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

// Multer Upload Middleware
const upload = multer({
  storage, // Use the custom storage configuration
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter, // Apply the file filter
});

module.exports = upload;
