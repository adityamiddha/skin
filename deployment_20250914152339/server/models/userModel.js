const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },

    email: {
        type: String,
        required: [true, 'PLease enter your email'],
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 6,
        select: false // prevents password from being sent in responses
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Hash Password before saving

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password check method
userSchema.methods.correctPassword = async function (inputPassword, userPassword) {
    return await bcrypt.compare(inputPassword, userPassword);
}

module.exports = mongoose.model('User', userSchema);