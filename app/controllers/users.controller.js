const User = require("../models/user.model");
const { success, notFound, error } = require("../services/response")
exports.index = ({ querymen: { query, select, cursor } }, res, next) =>
    User.find(query, select, cursor)
        .then(success(res))
        .catch(next)


exports.show = ({ params: { id } }, res, next) =>
    User.findById(id)
        .then(success(res))
        .catch(() => notFound(res)("Not found user"))
exports.showMe = async (req, res, next) => {
    success(res)(req.user)
}
exports.create = async ({ bodymen: { body } }, res, next) => {
    try {
        const user = await User.create(body);
        const token = await user.generateAuthToken();
        success(res, 201)({ user, token });
    } catch (err) {

        if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(Error("Student already registered"));
        else error(res)(err);
    }
}

exports.login = async ({ body: { studentCode, password } }, res, next) => {
    try {
        const user = await User.findByCredentials(studentCode, password)
        if (!user) return error(res, 401)(Error('Login failed! Check authentication credentials'));
        const token = await user.generateAuthToken()
        success(res)({ user, token })
    } catch (err) {
        error(res)(err);
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save();
        success(res)({ message: "Logout success!" });
    } catch (error) {
        error(res, 500)(Error("Logout error!"));
    }
}

exports.logoutAll = async (req, res, next) => {
    try {
        req.user.tokens = []
        await req.user.save();
        success(res)({ message: "Logout success!" });
    } catch (error) {
        error(res, 500)(Error("Logout error!"));
    }
}