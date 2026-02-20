const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, orderController.createOrder);
router.put("/:id", verifyTokenAndAdmin, orderController.updateOrder);
router.delete("/:id", verifyTokenAndAdmin, orderController.deleteOrder);
router.get("/find/:id", verifyTokenAndAuthorization, orderController.getUserOrders);
router.get("/", verifyTokenAndAdmin, orderController.getAllOrders);

module.exports = router;
