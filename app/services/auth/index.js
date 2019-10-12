const jwt = require('jsonwebtoken')
const User = require('../../models/user.model');
const { error } = require("../response")
const auth = async (req, res, next) => {
    try {
        if (!req.header('Authorization')) throw new Error();
        const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) throw new Error()

        req.user = user;
        req.token = token;
        next()
    } catch (e) {
        error(res, 401)(Error('Not authorized to access this resource'))
    }

}
module.exports = auth