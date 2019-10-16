const express = require('express');
const router = express.Router();
const auth = require("../services/auth");
const { selectSemester, save, search, showMe } = require("../controllers/schedules.controller");
router.get('/me', auth, showMe);
router.get("/me/semesters", auth, selectSemester);
router.post("/me/save", auth, save);
router.post("/me/search", auth, search);
module.exports = router;
