const indexRouter = require('./routes/index.route');
const usersRouter = require('./routes/users.route');
const schedulesRouter = require('./routes/schedules.route');

module.exports = function(app) {

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/schedules', schedulesRouter);
}