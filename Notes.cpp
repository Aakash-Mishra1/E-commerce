// ✅ Your Understanding:

// “User ne login kiya → 1 min baad backend ko kaise pata chalega ki user login hai ki nahi?
// Agar JWT na ho to har request me username–password jana chahiye.”

// ✔ Bilkul sahi point.

// ⚠️ But small correction:
// ❌ Backend ko 1 minute ke baad bhi “login state” yaad nahi rehta

// Backend stateless hota hai.
// Server user ko kabhi bhi yaad nahi rakhta.

// Isliye:

// 👉 Without JWT = Har request me username & password jana padega

// Ye unsafe + slow + stupid hoga.

// ⭐ Now your JWT understanding:

// “User login kare → backend ek unique token banata hai → backend ek hi baar verify karta hai → jab tak token valid hai user koi bhi activity kar sakta hai.”

// ✔ Almost correct
// Bas ek point correct kar deta hoon.

// 🟢 Full Correct Version (100% correct explanation):
// 1️⃣ Login ke time:

// User → (email + password) → Backend.

// Backend:

// Password verify karta h

// Ek JWT token generate kar deta h

// Token frontend ko de deta h

// This token = user ka digital ID card

// 2️⃣ After login:

// User jab bhi koi request karega (example: “Buy product”),
// frontend ye token bhejega:

// Authorization: Bearer <jwt_token>

// Backend kya karega?

// ✔ Token check karega
// ✔ Agar token valid hai → backend bolta h:

// "Haan ye banda authenticated hai."

// ✔ User ko aage proceed karne deta h

// 🟥 ❌ Small correction:

// “Backend user ko ek baar hi verify karta hai”

// Galat.

// ✔ Backend HAR request par token verify karta h

// But token verify karna bahut fast hota hai, username-password verify karne se 100x faster.

// Isliye performance issue nahi hota.
//////////////////////////////////////////////

//  type: mongoose.Schema.Types.ObjectId,                   //iska kya matlab h niche pura explained h



// 1️⃣ mongoose

// Ye tumhare Node.js backend me install hota package hai.

// 👉 Ye MongoDB se connect hone aur schema banane ka kaam karta hai.

// Example:

// const mongoose = require("mongoose");

// So mongoose = tool to talk to MongoDB

// 2️⃣ Schema

// Mongoose ke andar ek feature:

// Jisse tum database ke structure define karte ho

// Kya fields honge

// Kya type hoga

// Required / default kya hoga

// Example:

// const userSchema = new mongoose.Schema({...})


// So Schema = design of your DB table

// 3️⃣ Types

// Schema ke andar ek object hota hai jisme sare data types hote hain.

// Example:

// Types.String

// Types.Number

// Types.ObjectId

// Types.Boolean

// Ye basically mongoose ko ye batata hai:
// “Is field me kis type ka data aayega?”

// So Types = Mongoose ka data type store folder

// 4️⃣ ObjectId

// Ye MongoDB ka unique ID type hota hai.
// Har document ka _id issi type ka hota hai.

// Examples:

// 65a432d902bb9cde24a31e90


// Ye ID:

// Auto-generate hota hai

// Unique hota hai

// Users, Products, Orders sab mein hota hai

// So ObjectId = MongoDB ka unique ID format

// 🔥 Ab sab ko combine karke dekho:
// mongoose.Schema.Types.ObjectId


// Matlab:

// “Schema ke andar jo data type use hoga — wo ObjectId hoga.”

///////////////////////////////////
// 1️⃣ What these websites actually are  (firebase for different authentication and login option)

// Websites like Google, Facebook, GitHub, Auth0, etc. are identity providers (IdPs) or authentication service providers.

// Identity Provider (IdP) = A service that can verify a user's identity for you.

// They handle verifying emails, passwords, social accounts, tokens, etc.

// They are trusted systems that have already verified that the user is who they claim to be.

// You don’t need to handle passwords or verify email validity yourself if you use them.