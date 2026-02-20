const userController = require("../controllers/userController");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

const router = require("express").Router();

// User create karne ke liye (Signup)
// router.post("/", userController.createUser);

// User login karne ke liye
router.post("/login", userController.loginUser);

// Addresses Management
router.post("/:id/address", verifyTokenAndAuthorization, userController.addAddress);
router.delete("/:id/address/:addressId", verifyTokenAndAuthorization, userController.removeAddress);

// Reviews Management
router.get("/:id/reviews", userController.getUserReviews);

// User ko update karne ke liye
router.put("/:id", verifyTokenAndAuthorization, userController.updateUser);
// User ko delete karne ke liye
router.delete("/:id", verifyTokenAndAuthorization, userController.deleteUser);
//  User lene ke liye
router.get("/find/:id", verifyTokenAndAuthorization, userController.getUser);
// Sare users lene ke liye(Get all user)
router.get("/", verifyTokenAndAdmin, userController.getAllUsers);
// Sare users ke stats lene ke liye
router.get("/stats", verifyTokenAndAdmin, userController.getUserStats);

// Redeem Points
router.post("/:id/redeem", verifyTokenAndAuthorization, userController.redeemPoints);

module.exports = router;
