
const mongoose = require("mongoose");
const Review = require("./models/Review");
const User = require("./models/User");
const Product = require("./models/Product"); // Include Product model to register schema
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
    checkUserReviews();
  })
  .catch((err) => console.log(err));

async function checkUserReviews() {
  try {
    // 1. Find the main user
    const user = await User.findOne({ email: "rahul@example.com" });
    if (!user) {
        console.log("User rahul@example.com not found. Finding any user.");
    }
    const targetUser = user || await User.findOne();
    
    if (!targetUser) {
        console.log("No users found.");
        return;
    }

    console.log(`Checking reviews for user: ${targetUser._id} (${targetUser.username})`);

    // Dump all users to see who is who
    const allUsers = await User.find();
    console.log("All Users:");
    allUsers.forEach(u => console.log(`- ${u._id}: ${u.username} (${u.email})`));

    // 2. Fetch reviews
    const reviews = await Review.find({ user: targetUser._id }).populate('product');
    console.log(`Found ${reviews.length} reviews.`);
    reviews.forEach(r => {
        console.log(`- Review for ${r.product ? r.product.title : 'Deleted Product'}: ${r.comment} (${r.rating} stars)`);
    });

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}
