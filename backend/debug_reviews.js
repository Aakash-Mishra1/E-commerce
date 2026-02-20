
const mongoose = require("mongoose");
const Review = require("./models/Review");
const User = require("./models/User");
const Product = require("./models/Product"); // Ensure product model is loaded
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
    checkReviews();
  })
  .catch((err) => console.log(err));

async function checkReviews() {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    console.log(`Total Reviews: ${reviews.length}`);
    
    if (reviews.length > 0) {
      console.log("Last 3 reviews:");
      // Log full details for debugging
      console.log(JSON.stringify(reviews.slice(0, 3), null, 2));

      // Check specifically for user field type and value
      reviews.slice(0, 3).forEach((r, i) => {
          console.log(`Review ${i} User ID type:`, typeof r.user);
          console.log(`Review ${i} Product ID type:`, typeof r.product);
      });
    } else {
        console.log("No reviews found.");
    }

    const users = await User.find();
    console.log(`Total Users: ${users.length}`);

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}
