const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateUser,
  authorizeAdmin,
  upload.array("productImages", 5),
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:category", productController.getProductsByCategory);
router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  upload.array("productImages", 5),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  productController.deleteProduct
);

module.exports = router;
