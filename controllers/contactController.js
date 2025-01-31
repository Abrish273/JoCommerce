const { contactSchema, sendEmail } = require("../utils/contact");

exports.contact = async (req, res) => {
  try {
    // Validate the input data
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // If the data is valid, process it
    const { fullName, email, message } = req.body;

    // Send the received data to the specified email
    await sendEmail(fullName, email, message);

    // Respond back to the user
    res.status(200).json({
      success: true,
      message: "Your message has been received.",

    });
  } catch (err) {
    console.error("Error processing the request:", err);
    res.status(500).json({
      success: false,
      message: "somthing went wrong try again later",
    });
  }
};
