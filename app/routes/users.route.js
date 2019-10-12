const express = require('express');
const router = express.Router();
const { middleware: query } = require("querymen");
const { middleware: body } = require("bodymen");
const auth = require("../services/auth");
const { index, show, create, login, showMe} = require("../controllers/users.controller");
router.get('/', query(), index);
router.post('/', body({
    studentCode: String,
    password: String,
    name: String,
    className: String
}), create);
router.post('/login', login);
router.get('/me', auth, showMe);
router.get('/:id', query(), show);
module.exports = router;
