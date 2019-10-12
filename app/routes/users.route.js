const express = require('express');
const router = express.Router();
const { middleware: query } = require("querymen");
const { middleware: body } = require("bodymen");
const { index, show , create} = require("../controllers/users.controller");
router.get('/', query(), index);
router.post('/', body({
    studentCode: String,
    password: String,
    name: String,
    className: String
}), create);
router.get('/:id', query(), show);
module.exports = router;
