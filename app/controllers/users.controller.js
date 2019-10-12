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


exports.create = async ({ bodymen: { body } }, res, next) => {
    try {
        const { studentCode, password } = body;
        const isCorrectPassword = await User.checkLogin(studentCode, password);
        if(!isCorrectPassword) return error(res, 401)(Error("Check authentication credentials!"));
        const user = await User.create(body);
        const token = await user.generateAuthToken();
        success(res, 201)({ user, token });
    } catch (err) {

        if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(Error("Student already registered"));
        else error(res)(err);
    }
}
