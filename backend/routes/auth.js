const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//route POST /api/authenticated/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });

    // Generate karne ke liye JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: userPassword, ...userData } = user._doc;
    res.status(201).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//route POST /api/authenticated/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if(!email || !password) return res.status(400).json({ message: "Email and password required" });
  
  try {
    const user = await User.findOne({ email })
        .populate("wishlist")
        .populate("cart.productId");

    if (!user) return res.status(400).json({ message: "Invalid credentials (User not found)" });


    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials (Password mismatch)" });

    // Generate karne ke liye JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    // Send full user data (excluding password)
    const { password: userPassword, ...userData } = user._doc;
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/social-login
router.post("/social-login", async (req, res) => {
  const { email, name, uid, provider } = req.body;

  if (!email || !uid) return res.status(400).json({ message: "Invalid data" });

  try {
    let user = await User.findOne({ email }).populate("wishlist").populate("cart.productId");

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        username: name || email.split("@")[0], // Fallback if name is missing
        email,
        password: uid, // store UID as password placeholder (or use a random strong password)
        isAdmin: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: userPassword, ...userData } = user._doc;
    res.status(200).json({ user: userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
