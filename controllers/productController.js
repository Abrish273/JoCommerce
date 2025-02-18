require("dotenv").config();

const Product = require("../models/Product");

const BACKEND_URL = process.env.BACKEND_URL;
// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { productName, price, productType } = req.body;
    const productImages = req.files.map(
      (file) => `${BACKEND_URL}/public/uploads/${file.filename}`
    );

    if (!productName || !price || !productType) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const product = new Product({
      productName,
      productImages,
      price,
      productType,
    });

    await product.save();
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Read all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Read one product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    // Case-insensitive and partial matching using regex
    const products = await Product.find({
      productName: { $regex: query, $options: "i" }, // 'i' makes it case-insensitive
    }).limit(10); // Limit results to improve performance

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Read products by category (man/woman)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!["man", "woman"].includes(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category type" });
    }
    const products = await Product.find({ productType: category }).sort({ createdAt: -1 });;
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { productName, price, productType } = req.body;
    const productImages = req.files.map(
      (file) => `${BACKEND_URL}/public/uploads/${file.filename}`
    );
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, productImages, price, productType },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
