const userController = require("../controllers/userController");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

const router = require("express").Router();

// UPDATE A USER
router.put("/:id", verifyTokenAndAuthorization, userController.updateUser);

// DELETE A USER
router.delete("/:id", verifyTokenAndAuthorization, userController.deleteUser);

// GET A USER
router.get("/find/:id", verifyTokenAndAdmin, userController.getUser);

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, userController.getAllUsers);

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, userController.getUserStats);

module.exports = router;
