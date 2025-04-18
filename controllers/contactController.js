const Contact = require("../models/Contact");
const { contactSchema, sendEmail } = require("../utils/contact");

// exports.contact = async (req, res) => {
//   try {
//     // Validate the input data
//     const { error } = contactSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     // If the data is valid, process it
//     const { fullName, email, message } = req.body;

//     // Send the received data to the specified email
//     await sendEmail(fullName, email, message);

//     // Respond back to the user
//     res.status(200).json({
//       success: true,
//       message: "Your message has been received.",

//     });
//   } catch (err) {
//     console.error("Error processing the request:", err);
//     res.status(500).json({
//       success: false,
//       message: "somthing went wrong try again later",
//     });
//   }
// };

exports.contact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await contact.save();
    return res.status(200).json({
      success: true,
      contact,
      message: "Your message has been received.",
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong try again later",
    });
  }
};


exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong try again later",
      mssg: error.message,
    });
  }
};