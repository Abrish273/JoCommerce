const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");


router.post("/", contactController.contact);
router.get(
  "/",
  authenticateUser, 
  authorizeAdmin,
  contactController.getAllContacts
);

module.exports = router;
