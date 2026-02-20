const User = require("../models/User");
const Review = require("../models/Review"); // Reviews model imported
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Add Address
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found");

        const newAddress = { ...req.body, isDefault: req.body.isDefault || false };
        
        // If set as default, unset others first
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        const updatedUser = await user.save();
        
        // Return updated user object minus password
        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Remove Address
exports.removeAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found");

        // Filter out the address to delete
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
        await user.save();

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get My Reviews
exports.getUserReviews = async (req, res) => {
    try {
        let userId = req.params.id;
        
        // Handle Demo User Case
        if (userId === "demo1") {
             const demoUser = await User.findOne({ email: "rahul@example.com" });
             if (demoUser) userId = demoUser._id;
             else {
                 // Fallback to finding ANY user to show something
                 const anyUser = await User.findOne();
                 if (anyUser) userId = anyUser._id;
             }
        }

        const reviews = await Review.find({ user: userId })
            .populate('product', 'name image price')
            .sort({ createdAt: -1 }); // Sort by newest first
            
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching user reviews:", err);
        res.status(500).json(err);
    }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong credentials!");

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update karne ke liye
exports.updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    .populate("wishlist")
    .populate({
        path: "cart.productId",
        model: "Product"
    });

    // Handle cart population failure gracefully
    // ...

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete karne ke liye
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// User lene ke liye ye use hoga
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
                       .populate("wishlist")
                       .populate("cart.productId");
                       
    if (!user) return res.status(404).json("User not found");
    
    // Flatten cart structure for easier frontend consumption if needed, 
    // or frontend adapts. Let's keep backend standard.
    
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllUsers = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// User ka status ke liye
exports.getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Redeem Points for Coupon
exports.redeemPoints = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found");

        const pointsToRedeem = req.body.pointsToRedeem || 500;
        const discountAmount = req.body.discountAmount || 50;

        if (user.points < pointsToRedeem) {
            return res.status(400).json({ message: "Insufficient points!" });
        }

        user.points -= pointsToRedeem;
        
        const couponCode = `SAVE${discountAmount}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        user.coupons.push({
            code: couponCode,
            discount: discountAmount,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
        });

        await user.save();
        
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};
