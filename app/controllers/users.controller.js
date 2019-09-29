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


exports.create = ({ bodymen: { body } }, res, next) =>
    User.create(body)
        //.then((user) => user.view(true))//
        .then(success(res, 201))
        .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) error(res, 409)(Error("Email already registered"))
            else error(res)(err);
        })