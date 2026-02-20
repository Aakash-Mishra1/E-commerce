const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,  //required means ki hume ye detail fill karni hi hongi agar nhi to error show karega 
      trim: true,   //if user gives spaces then usko htane ke liye
      minlength: 3,  //minimum length itni to hogi chahiye 
    },

    email: {
      type: String,
      required: true,
      unique: true,   //email unique hoga to avoid conflicts
      lowercase: true,  //upper case and lower case dono mein email differently treat karta h mongodb so this will automatically converts email into lower case ki koi confusion na ho
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    
    phone: { type: String },
    dob: { type: Date },

    points: {
      type: Number,
      default: 0
    },
    coupons: [
      {
        code: String,
        discount: Number,
        expiryDate: Date,
        isUsed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    addresses: [
      {
        fullName: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }  //kab user ne login kiya and kabkab wo kuch operation perform kar rha h
); 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
//module.exports  => taki dusri files inko use kar sakein
// mongoose.model("User", userSchema); => ye mongoose ko bolta h ki eek user naam ka model bna jiska structure userSchema ho
