const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/orderRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const paymentRoute = require("./routes/paymentRoutes");

dotenv.config();
const app = express();

const dbUrl = process.env.MONGODB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/auth", authRoute);


app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/payment", paymentRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
