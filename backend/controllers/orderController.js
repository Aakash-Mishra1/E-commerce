const Order = require("../models/Order");
const User = require("../models/User"); // Import User model

// create karne ke liye order ko
exports.createOrder = async (req, res) => {
    // Security: Override userId with the authenticated user's ID
    if (req.user && req.user.id) {
        req.body.userId = req.user.id;
    }

    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        
        // Add 1000 points to user & Consume Coupon if used
        if(req.body.userId) {
            const updateOps = {
                $inc: { points: 1000 }
            };

            // If a coupon was used, mark it as isUsed: true
            if (req.body.couponCode) {
                 // We need to find the specific coupon in the array and update it
                 // Since we can't easily do two operations in one update without arrayFilters which requires finding the index...
                 // Let's do it in two steps or use $set with arrayFilters if we are confident. 
                 // Simpler approach: Fetch user, update, save. Or findOneAndUpdate with array filter.
                 
                 // Using arrayFilters to update specific element in array
                 await User.updateOne(
                    { _id: req.body.userId, "coupons.code": req.body.couponCode },
                    { 
                        $set: { "coupons.$.isUsed": true },
                        $inc: { points: 1000 }
                    }
                 );
            } else {
                 await User.findByIdAndUpdate(req.body.userId, updateOps);
            }
        }
        
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update karne ke liye order ko
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
};

//  delete karne ke liye order ko
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};

// User se order lene ke liye
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.id });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
};

// sare orders lene ke liye admin ke liye
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'username email');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
};
