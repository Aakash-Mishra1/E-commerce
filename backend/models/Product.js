const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  //ye fill karna hi padega its compulsory
      trim: true,     //to remove spaces , agar user spaces add kar deta h to
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true, 
    },
    
    images: {
      type: [String],
      default: []
    },

    video: {
      type: String, // Video URL for the product
      default: ""
    },

    description: {
      type: String,
      trim: true,
    },
     rating: { 
        type: Number,
         default: 0
    },
    reviews: {
         type: Number,
        default: 0
    },
    stock: {
      type: Number,
      default: 0
    }, 
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Product", productSchema);
