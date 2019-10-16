const mongoose = require("mongoose");
const login = require("tin-chi-kma")({});
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
    const user = this;
    const { studentCode, password } = user;
    const correctPass = await user.checkLogin();
    if (!correctPass) next(Error("studentCode / password is not correct!"));
    try {
        const { displayName } = await user.showInfo();
        user.className = studentCode.slice(0, 2);
        user.name = displayName;
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

UserSchema.methods.checkLogin = async function() {
    const { studentCode, password } = this;
    try {
        const api = await login({ user: studentCode, pass: password });
        return true;
    } catch (error) {
        return false;
    }
}
UserSchema.methods.login = async function() {
    const { studentCode, password } = this;
    const api = await login({ user: studentCode, pass: password });
    return api
}
UserSchema.methods.showInfo = async function() {
    const api = await this.login();
    const information = await api.studentProfile.show();
    return information;
}
UserSchema.methods.showSemesters = async function() {
    const api = await this.login();
    const semesters = await api.studentTimeTable.showSemesters();
    if (semesters) return semesters.map(({ name, value }) => ({ name, drpSemester: value }))
    return semesters;
}

UserSchema.methods.showTimeTable = async function(drpSemester) {
    const api = await this.login();
    const timetable = await api.studentTimeTable.showTimeTable(drpSemester);
    return timetable;
}

UserSchema.statics.findByCredentials = async (studentCode, password) => {
    const user = await User.findOne({ studentCode })
    if (!user) return Promise.reject(Error('User is not exist!'));
    const correctPass = await user.checkLogin();
    const isPasswordMatch = (password === user.password);
    if (!correctPass) return Promise.reject(Error('Password is not correct!'));
    if (!isPasswordMatch) {
        user.password = password;
    }
    await user.save();
    return user;
}

const User = mongoose.model('user', UserSchema);

module.exports = User;