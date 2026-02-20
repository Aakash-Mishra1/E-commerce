const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const users = [
    {
        username: "Rahul Demo",
        email: "rahul@example.com",
        password: "user123",
        isAdmin: false,
        points: 500,
        addresses: []
    },
    {
        username: "Admin Demo",
        email: "admin@techstore.com",
        password: "admin123",
        isAdmin: true,
        points: 1000,
        addresses: []
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB for seeding users...");
        
        // Remove existing demo users to avoid duplicates/conflicts
        await User.deleteMany({ email: { $in: ["rahul@example.com", "admin@techstore.com"] } });
        console.log("Cleaned up old demo users...");

        // Hash passwords before saving
        const hashedUsers = await Promise.all(users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));
        
        // Insert new users
        await User.insertMany(hashedUsers);
        console.log("Added demo users successfully!");
        console.log("Login Credentials:");
        console.log("Customer: rahul@example.com / user123");
        console.log("Admin: admin@techstore.com / admin123");
        
        mongoose.connection.close();
    } catch (err) {
        console.log("Error seeding users:", err);
    }
};

seedUsers();
