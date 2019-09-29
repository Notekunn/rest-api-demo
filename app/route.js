const indexRouter = require('./routes/index.route');
const usersRouter = require('./routes/users.route');

module.exports = function(app) {

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
}