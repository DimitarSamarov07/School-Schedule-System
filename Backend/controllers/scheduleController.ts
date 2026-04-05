import {ScheduleService} from "../Services/data/ScheduleService.ts";
import {
    BulkScheduleQuerySchema,
    ClassDateScheduleQuerySchema,
    CreateScheduleQuerySchema,
    DateAndTimeScheduleQuerySchema,
    DateQueryScheduleSchema,
    DateRangeScheduleQuerySchema,
    UpdateScheduleQuerySchema
} from "../Validators/ScheduleValidators.ts";

export const getScheduleById = async (req, res) => {
    const id = Number(req.query.id);
    const schoolId = Number(req.query.schoolId);

    if (!id || !schoolId) return res.status(400).send("Malformed parameters");

    const result = await ScheduleService.getSchoolScheduleById(id, schoolId);
    return result ? res.send(result) : res.status(404).send("Schedule not found");
};

export const getSchoolSchedulesByDate = async (req, res) => {
    const payload = DateQueryScheduleSchema.parse(req.query);
    const result = await ScheduleService.getAllSchedulesForDateForSchool(payload);
    res.send(result);
};

export const getSchoolScheduleBetweenDates = async (req, res) => {
    const payload = DateRangeScheduleQuerySchema.parse(req.query);
    const result = await ScheduleService.getAllSchedulesForSchoolBetweenDates(payload);
    res.send(result);
};

export const getSchedulesByClassForDate = async (req, res) => {
    const payload = ClassDateScheduleQuerySchema.parse(req.query);
    const result = await ScheduleService.getSchoolSchedulesForDateByClass(payload);
    res.send(result);
};

export const getSchedulesByDateTimeAndSchool = async (req, res) => {
    const payload = DateAndTimeScheduleQuerySchema.parse(req.query);
    const result = await ScheduleService.getSchoolSchedulesByDateAndTime(payload);

    if (result.length === 0) return res.status(404).send({error: "No schedules found"});
    res.send(result);
};

export const createSchedule = async (req, res) => {
    const payload = CreateScheduleQuerySchema.parse({
        schoolId: req.query.schoolId,
        ...req.body
    });

    const result = await ScheduleService.createSchedule(payload);
    res.status(201).send(result);
};

export const bulkCreateSchedulesForRange = async (req, res) => {
    const payload = BulkScheduleQuerySchema.parse({
        schoolId: req.query.schoolId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        schedules: req.body.payload
    });

    await ScheduleService.bulkCreateSchedules(payload);
    res.status(201).send(true);
};

export const updateSchedule = async (req, res) => {
    const payload = UpdateScheduleQuerySchema.parse({
        schoolId: req.query.schoolId,
        ...req.body
    });

    const result = await ScheduleService.updateSchedule(payload);
    res.send(result);
};

export const deleteSchedule = async (req, res) => {
    const id = Number(req.query.id);
    const schoolId = Number(req.query.schoolId);

    if (!id || !schoolId) return res.status(400).send("Malformed parameters");

    const result = await ScheduleService.deleteSchedule(id, schoolId);
    return result ? res.send(result) : res.status(422).send(false);
};