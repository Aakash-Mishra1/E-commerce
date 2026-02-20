
const mongoose = require("mongoose");
const Product = require("./models/Product");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
    checkProducts();
  })
  .catch((err) => console.log(err));

async function checkProducts() {
  try {
    const products = await Product.find();
    console.log(`Total Products: ${products.length}`);
    if (products.length > 0) {
        console.log("First 3 products:");
        products.slice(0, 3).forEach(p => console.log(`- ${p.title || p.name} (ID: ${p._id})`));
    } else {
        console.log("No products found in DB.");
    }
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}
