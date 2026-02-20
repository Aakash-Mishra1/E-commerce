const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      default: "pending", // pending, shipped, delivered, cancelled ye sab form mein ho sakta h
    },

    paymentInfo: {
      id: String,
      status: String,
      method: String,
      receipt: String,
    },
  },
  { timestamps: true }   //kab user ne login kiya and kabkab wo kuch operation perform kar rha h
);

module.exports = mongoose.model("Order", orderSchema);

