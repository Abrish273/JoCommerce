const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    productImages: { type: [String], required: true }, // Array of image URLs
    price: { type: Number, required: true, min: 0 },
    productType: {
      type: String,
      enum: ["man", "woman"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
