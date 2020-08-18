const createError = require('http-errors');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
require("./app/middleware")(app);
require("./app/route")(app);

app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection
    .once('open', function () {
        console.log("Connect DB Success!");
    })
    .on('error', function (error) {
        console.log(error.stack);
        process.exit(1);
    })
module.exports = app;
