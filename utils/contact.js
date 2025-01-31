const Joi = require("joi");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Define the validation schema
exports.contactSchema = Joi.object({
  fullName: Joi.string().min(3).required(), // Full name should be at least 3 characters long
  email: Joi.string().email().optional(), // Email is optional, but must be a valid email if provided
  message: Joi.string().min(10).required(), // Message should be at least 10 characters long
});

// Set up Nodemailer transporter with your email service
const transporter = nodemailer.createTransport({
  service: "gmail", // Example: using Gmail
  auth: {
    user: process.env.CONTACT_EMAIL, // Your email address
    pass: process.env.CONTACT_EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send email
exports.sendEmail = async (fullName, email, message) => {
  try {
    const mailOptions = {
      from: "your-email@gmail.com", // Sender address
      to: process.env.CONTACT_EMAIL, // Always send to this email
      subject: "New Contact Form Message", // Subject line
      text:
        `You have received a new message from ${fullName}.\n\n` +
        `Email: ${email || "No email provided"}\n\n` +
        `Message: \n${message}`, // Body of the email
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
