const mongoose = require("mongoose");
const login = require("tin-chi-kma")({});
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const UserSchema = new Schema({
    studentCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    className: {
        type: String,
        required: false,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

})

UserSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

UserSchema.statics.checkLogin = async (studentCode, password) => {
    try {
        const api = await login({ user: studentCode, pass: password });
        return true;
    } catch (error) {
        return false;
    }
}
UserSchema.statics.findByCredentials = async (studentCode, password) => {
    const user = await User.findOne({ studentCode })
    if (!user) return Promise.reject(Error({ error: 'User is not exist!' }));
    const correctPass = await User.checkLogin(studentCode, password);
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!correctPass) return Promise.reject(Error({ error: 'Password is not correct!' }));
    if (!isPasswordMatch) {
       user.password = await bcrypt.hash(password, 8)
    }
    await user.save();
    return user;
}

const User = mongoose.model('user', UserSchema);

module.exports = User;