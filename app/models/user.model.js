const mongoose = require("mongoose");
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
        required: true,
        trim: true
    },
    className: {
        type: String,
        required: false,
        trim: true,
    },
})

const User = mongoose.model('user', UserSchema);

module.exports = User;