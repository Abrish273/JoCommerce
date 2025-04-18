require("dotenv").config();

const Product = require("../models/Product");

const BACKEND_URL = process.env.BACKEND_URL;
// Create a new product
exports.createProduct = async (req, res) => {
  console.log("=== Here in createProduct ===");
  try {
    const { productName, price, productType, productDesc } = req.body;
    const productImages = req.files.map(
      (file) => `${BACKEND_URL}/public/uploads/${file.filename}`
    );

    console.log("productName", productName);
    console.log("productType", productType);
    console.log("price", price);
    console.log("productImages", productImages);
    console.log("productDesc", productDesc);

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
      productDesc,
    });

    await product.save();
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaginatedProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, productType, search } = req.query;

    const query = {};

    // Filter by productType if provided
    if (productType) {
      query.productType = productType;
    }

    // Search by productName if provided
    if (search) {
      query.productName = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const result = await Product.paginate(query, options);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message,
    });
  }
};

// Read all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     return res.status(200).json({ success: true, products });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "something went wrong try again later",
//       mssg: error.message,
//     });
//   }
// };

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
exports.updateProduct = async (req, res) => {
  try {
    const { productName, price, productType, productDesc } = req.body;
    const productImages = req.files.map(
      (file) => `${BACKEND_URL}/public/uploads/${file.filename}`
    );
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, productImages, price, productType, productDesc },
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    console.log("====", product);

    // Delete each image from the file system
    //  product.productImages.forEach((imageUrl, index) => {
    //    console.log(`\n[${index + 1}] Processing image URL: ${imageUrl}`);

    //    const filename = imageUrl.split("/uploads/")[1];
    //    console.log(`[${index + 1}] Extracted filename: ${filename}`);

    //    const filePath = path.join(__dirname, "..", "public", "uploads", filename);
    //    console.log(`[${index + 1}] Full file path: ${filePath}`);

    //    fs.unlink(filePath, (err) => {
    //      if (err) {
    //        console.error(
    //          `[${index + 1}] ❌ Failed to delete: ${filePath}`,
    //          err.message
    //        );
    //      } else {
    //        console.log(`[${index + 1}] ✅ Successfully deleted: ${filePath}`);
    //      }
    //    });
    //  });

    return res.status(200).json({
      success: true,
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
