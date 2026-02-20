const router = require("express").Router();
const productController = require("../controllers/productController");
const { verifyTokenAndAdmin } = require("../middleware/authMiddleware");

// Create (sirf Admin ke liye h)
router.post("/", verifyTokenAndAdmin, productController.createProduct);
// Update (sirf Admin ke liye h)
router.put("/:id", verifyTokenAndAdmin, productController.updateProduct);
// Delete (sirf Admin ke liye h)
router.delete("/:id", verifyTokenAndAdmin, productController.deleteProduct);
router.get("/find/:id", productController.getProduct);  // Get One
router.get("/", productController.getAllProducts);  // Get All

module.exports = router;





