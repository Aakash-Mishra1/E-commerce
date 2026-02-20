const router = require("express").Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, reviewController.createReview);
router.get("/product/:productId", reviewController.getProductReviews);
router.get("/", reviewController.getAllReviews);

module.exports = router;
