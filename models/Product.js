const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    productImages: { type: [String], required: true }, // Array of image URLs
    price: { type: Number, required: true, min: 0 },
    productType: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },
    productDesc: { type: String, required: false }, // trim: true },
  },
  { timestamps: true }
);

// Add the pagination plugin
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
