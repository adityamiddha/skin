const jwt = require('jsonwebtoken');

// Function to create a JWT token with user ID
exports.createToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
