const mongoose = require("mongoose");
const moment = require("moment-timezone");
const TIME_ZONE = process.env.TIME_ZONE || "Asia/Ho_Chi_Minh";
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
    studentCode: String,
    day: Date,
    dayOfWeek: {
        type: Number,
        enum: [2, 3, 4, 5, 6, 7, 8],
        default: 2
    },
    subjectCode: String,
    subjectName: String,
    className: String,
    teacher: String,
    lesson: String,
    room: String
})
ScheduleSchema.pre("save", async function(next) {
    const { studentCode, day, lesson, subjectCode } = this;
    const existSchedule = await Schedule.find({ studentCode, day, lesson, subjectCode });
    if (existSchedule && existSchedule.length != 0) next(Error("Schedule is exits."));
    else next();
})
ScheduleSchema.statics.saveTimeTable = async (user, drpSemester) => {
    const { studentCode } = user;
    const timetable = await user.showTimeTable(drpSemester);
    const schedule = timetable.map(lesson => {
        lesson.studentCode = studentCode;
        lesson.dayOfWeek = moment(lesson.day, "DD/MM/YYYY").isoWeekday() + 1;
        lesson.day = moment(lesson.day, "DD/MM/YYYY", TIME_ZONE);
        return lesson;
    })
    const inserted = await Schedule.create(schedule);
    return inserted;
}
const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;