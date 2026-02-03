import {PeriodService as periodService} from "../Services/data/PeriodService.ts";

export const deletePeriod = async (req, res) => {
    const {id} = req.query;
    try {
        const result = await periodService.deletePeriod(id);
        return result ? res.status(422).send(false) : res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const getCurrentPeriod = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await periodService.getRunningPeriodForSchool(schoolId);
        if (result === null) {
            return res.status(204).send({label: null, startTime: null, endTime: null});
        }
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const getNextPeriod = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await periodService.getNextRunningPeriodForSchool(schoolId);
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const getAllPeriods = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await periodService.getAllPeriodsForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        const status = err === "No breaks found" ? 404 : 500;
        return res.status(status).send({error: err});
    }
};

export const createPeriod = async (req, res) => {
    const {schoolId} = req.query;
    const {name, start, end} = req.body;
    if (!start || !end) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await periodService.createPeriod(schoolId, name, start, end);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const updatePeriod = async (req, res) => {
    const {id} = req.query;
    const {name, start, end} = req.body;
    if ((!start && !end) || !id) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await periodService.updatePeriod(id, name, start, end);
        return result ? res.status(422).send(false) :  res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};