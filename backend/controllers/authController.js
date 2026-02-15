const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword, 
            isAdmin: req.body.isAdmin || false
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

// LOGIN
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            console.log("User not found:", req.body.email);
            return res.status(401).json("Wrong credentials!");
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (!isPasswordValid) {
            console.log("Invalid password for:", req.body.email);
            return res.status(401).json("Wrong credentials!");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        const userData = user.toObject();
        delete userData.password;
        
        res.status(200).json({ ...userData, accessToken });
    } catch (err) {
        console.error("Layout Error:", err);
        res.status(500).json({ message: err.message, stack: err.stack });
    }
}

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET || 'test', 
                { expiresIn: '3d' }
            );
            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken });
        } else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: 'google-auth-user',
                isAdmin: false,
            });
            const savedUser = await newUser.save();
            const accessToken = jwt.sign(
                {
                    id: savedUser._id,
                    isAdmin: savedUser.isAdmin,
                },
                process.env.JWT_SECRET || 'test',
                { expiresIn: '3d' }
            );
            const { password, ...others } = savedUser._doc;
            res.status(200).json({ ...others, accessToken });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

