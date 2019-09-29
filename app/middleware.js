const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require("express");
module.exports = function(app) {


    // view engine setup
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
}