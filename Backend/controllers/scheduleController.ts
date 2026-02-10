import {ScheduleService as scheduleService} from "../Services/data/ScheduleService.ts";
import moment from 'moment';

export const getSchoolSchedulesByDate = async (req, res) => {
    let {schoolId, date} = req.query;
    if (!date) return res.status(406).send("Malformed parameter");

    try {
        const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const result = await scheduleService.getAllSchedulesForDateForSchool(schoolId, formattedDate);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};

export const getSchoolScheduleBetweenDates = async (req, res) => {
    let {schoolId, startDate, endDate} = req.query;
    if (!startDate || !endDate) return res.status(406).send("Malformed parameters");

    try {
        const formattedStartDate = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
        const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')

        const result = await scheduleService.getAllSchedulesForSchoolBetweenDates(schoolId, formattedStartDate, formattedEndDate);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
}

export const getSchedulesByClassForDate = async (req, res) => {
    let {classId, date} = req.query;
    if (!date || !classId) return res.status(406).send("Malformed parameters");

    try {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        const classIdParsed = parseInt(classId);

        if (isNaN(classIdParsed)) return res.status(406).send("Malformed classId");

        const result = await scheduleService.getSchedulesByClassIdForDate(classIdParsed, formattedDate);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const getSchedulesByDateTimeAndSchool = async (req, res) => {
    const {schoolId, date, time} = req.query;
    try {
        const result = await scheduleService.getSchoolSchedulesByDateAndTime(schoolId, date, time);
        return res.send(result);
    } catch (err) {
        const status = err === "No schedules found" ? 404 : 500;
        return res.status(status).send({"error": err});
    }
};

export const createSchedule = async (req, res) => {
    const {courseId, classId, timeId, dateId} = req.body;
    if (!courseId || !classId || !timeId || !dateId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await scheduleService.createSchedule(courseId, classId, timeId, dateId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const updateSchedule = async (req, res) => {
    const {newCourseId, oldCourseId, newClassId, oldClassId, newTimeId, newDateId, oldDateId} = req.body;

    const hasRequired = oldCourseId && oldClassId && oldDateId;
    const hasUpdates = newCourseId || newClassId || newTimeId || newDateId;

    if (!hasRequired || !hasUpdates) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await scheduleService.updateSchedule(
            oldClassId, oldCourseId, oldDateId,
            newClassId, newCourseId, newTimeId, newDateId
        );
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const deleteSchedule = async (req, res) => {
    const {courseId, classId, timeId} = req.query;
    try {
        const result = await scheduleService.deleteSchedule(courseId, classId, timeId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};