const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/authMiddleware");

// Create (Verified User)
router.post("/", verifyToken, orderController.createOrder);

// Update (Admin)
router.put("/:id", verifyTokenAndAdmin, orderController.updateOrder);

// Delete (Admin)
router.delete("/:id", verifyTokenAndAdmin, orderController.deleteOrder);

// Get User Orders
router.get("/find/:id", verifyTokenAndAuthorization, orderController.getUserOrders);

// Get All (Admin)
router.get("/", verifyTokenAndAdmin, orderController.getAllOrders);

module.exports = router;
