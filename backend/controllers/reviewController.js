const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a review
exports.createReview = async (req, res) => {
    console.log("Creating review:", req.body);
    // If user is not provided in body, use from token (req.user is set by verifyToken middleware)
    if (!req.body.user && req.user) {
        req.body.user = req.user.id;
    }
    
    // Also ensure product field is set correctly (frontend might send productId)
    if (!req.body.product && req.body.productId) {
        req.body.product = req.body.productId;
    }

    // Handle "Product ID is not an ObjectId" case
    if (req.body.product && !mongoose.Types.ObjectId.isValid(req.body.product)) {
         console.warn(`Invalid Product ID format: ${req.body.product}. Trying fallback.`);
         try {
             const fallbackProduct = await Product.findOne();
             if (fallbackProduct) {
                 req.body.product = fallbackProduct._id;
             }
         } catch(e) { console.error(e); }
    } else if (req.body.product) {
         // Also check if the product actually exists!
         const exists = await Product.findById(req.body.product);
         if (!exists) {
             console.warn(`Product ${req.body.product} not found. Linking to fallback product.`);
             const fallbackProduct = await Product.findOne();
             if (fallbackProduct) req.body.product = fallbackProduct._id;
         }
    }

    // Handle Demo User Case
    if (req.body.user === "demo1") {
        try {
            // Find a real user to associate with (e.g., by email or create new)
            let realUser = await User.findOne({ email: "rahul@example.com" });
            if (!realUser) {
                 // Create if not exists (should exist from seed)
                 // But for safety, fallback to first user
                 realUser = await User.findOne();
            }
            if (realUser) {
                req.body.user = realUser._id;
            }
        } catch (e) {
            console.error("Error resolving demo user:", e);
        }
    }

    const newReview = new Review(req.body);
    try {
        const savedReview = await newReview.save();
        
        // Update Product Rating & Review Count
        try {
            const product = await Product.findById(req.body.product);
            if (product) {
                const reviews = await Review.find({ product: req.body.product });
                const count = reviews.length;
                const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / count;
                
                product.reviews = count;
                product.rating = avgRating;
                await product.save();
            }
        } catch (updateErr) {
            console.error("Failed to update product stats after review:", updateErr);
        }

        res.status(200).json(savedReview);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).json(err);
    }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all reviews (for admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'username').populate('product', 'title');
        res.status(200).json(reviews);
    } catch (err) {
         res.status(500).json(err);
    }
};
