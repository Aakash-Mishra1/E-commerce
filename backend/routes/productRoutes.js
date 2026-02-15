const router = require("express").Router();
const productController = require("../controllers/productController");
const { verifyTokenAndAdmin } = require("../middleware/authMiddleware");

// Create (Admin only)
router.post("/", verifyTokenAndAdmin, productController.createProduct);

// Update (Admin only)
router.put("/:id", verifyTokenAndAdmin, productController.updateProduct);

// Delete (Admin only)
router.delete("/:id", verifyTokenAndAdmin, productController.deleteProduct);

// Get One
router.get("/find/:id", productController.getProduct);

// Get All
router.get("/", productController.getAllProducts);

module.exports = router;
