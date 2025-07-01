const jwt = require("jsonwebtoken");
require("dotenv").config()

const generate_token = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: "1h" });
      return token
}

const verify_token = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

module.exports = {generate_token, verify_token}