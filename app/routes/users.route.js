const express = require('express');
const router = express.Router();
const { middleware: query } = require("querymen");
const { middleware: body } = require("bodymen");
const auth = require("../services/auth");
const { index, show, create, login, showMe, logout, logoutAll} = require("../controllers/users.controller");
router.get('/', query(), index);
router.post('/', body({
    studentCode: String,
    password: String,
    name: String,
    className: String
}), create);
router.post('/login', login);
router.get('/me', auth, showMe);
router.post('/me/logout', auth, logout);
router.post('/me/logoutall', auth, logoutAll);
router.get('/:id', query(), show);
module.exports = router;
