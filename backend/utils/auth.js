const jwt = require("jsonwebtoken");

const generate_token = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload, "shhhhh", { expiresIn: "1h" });
      return token
}

const verify_token = (token) => {
    try {
        const decoded = jwt.verify(token, "shhhhh");
        return decoded;
    } catch (err) {
        return null;
    }
}

module.exports = {generate_token, verify_token}