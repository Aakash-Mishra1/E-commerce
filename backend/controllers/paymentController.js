const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere", // Add these to .env later
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretHere"
});

// Create Order (Backend)
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Convert normal currency to smallest currency unit (paise for INR)
    // amount in req.body is likely already total string "194,649" or number.
    // It's safer to handle cleaning in backend or assume number.
    
    const options = {
      amount: Number(amount * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Verify Order (Backend)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    // We need secret here again
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YourSecretHere")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
