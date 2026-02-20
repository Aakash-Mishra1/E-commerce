const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.token && req.headers.token.startsWith("Bearer")) { 
     token = req.headers.token.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if(!req.user) {
         return res.status(401).json({ message: "User not found with this token" });
      }
      next();
    } catch (err) {
      res.status(403).json({ message: "Token is not valid!" });
    }
  } else {
    return res.status(401).json({ message: "You are not authenticated!" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin,
    protect: verifyToken // Alias protect to verifyToken for backward compatibility
};
