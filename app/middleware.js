const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require("express");
const fs = require("fs");
module.exports = function(app) {
    const { NODE_ENV } = process.env;
    const streamLog = fs.createWriteStream(path.resolve(__dirname, '../bin/request.log'), { flags: 'a' });
    const logMiddleware = logger(NODE_ENV == "production" ? 'combined' : 'dev', {
        // skip: (req, res) => res.statusCode < 400,
        stream: NODE_ENV == "production" ? streamLog : process.stdout
    })
    // view engine setup
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(logMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.resolve(__dirname, '../public')));
}