const Schedule = require("../models/schedule.model");
const { success, notFound, error } = require("../services/response");

exports.selectSemester = async (req, res, next) => {
    const user = req.user;
    try {
        const semeters = await user.showSemesters();
        success(res)(semeters);
    } catch (err) {
        error(res)(err);
    }
}

exports.save = async (req, res, next) => {
    const user = req.user;
    const drpSemester = req.body.drpSemester.trim() || "";
    try {
        const timetable = await Schedule.saveTimeTable(user, drpSemester);
        success(res)(timetable);
    } catch (err) {
        error(res)(err);
    }
}