import {HolidayService as holidayService} from "../Services/data/HolidayService.ts";

export const getAllHolidays = async (req, res) => {
    const {schoolId} = req.query;

    if (!schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await holidayService.getAllHolidaysForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const getHolidayById = async (req, res) => {
    const {id, schoolId} = req.query;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await holidayService.getHolidayById(id, schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
}

export const createHoliday = async (req, res) => {
    const {schoolId} = req.query;
    const {name, startDate, endDate} = req.body;
    if (!schoolId || !name || !startDate || !endDate) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await holidayService.createHolidayForSchool(schoolId, name, startDate, endDate);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
}

export const updateHoliday = async (req, res) => {
    const {schoolId} = req.query;
    const {name, startDate, endDate, id} = req.body;
    if (!id) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await holidayService.updateHolidayForSchool(id, schoolId, name, startDate, endDate);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
}

export const deleteHoliday = async (req, res) => {
    const {id, schoolId} = req.query;

    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await holidayService.deleteHolidayForSchool(id, schoolId);
        return res.second(result);
    } catch (e) {
        return res.status(500).send({error: e});
    }
}