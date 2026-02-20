
const mongoose = require("mongoose");
const Order = require("./models/Order");
const User = require("./models/User");
const Product = require("./models/Product"); // Load Product model
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
    checkOrders();
  })
  .catch((err) => console.log(err));

async function checkOrders() {
  try {
    const orders = await Order.find().limit(3).lean();
    console.log(`Checking ${orders.length} orders for product structure...`);

    orders.forEach((order, i) => {
        console.log(`Order ${i} ID: ${order._id}`);
        if (order.products && order.products.length > 0) {
            const p = order.products[0];
            console.log(`- Product[0] keys:`, Object.keys(p));
            console.log(`- productId:`, p.productId);
            console.log(`- _id (subdoc):`, p._id);
        } else {
            console.log(`- No products in this order.`);
        }
    });

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}
