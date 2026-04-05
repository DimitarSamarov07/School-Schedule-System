import {PeriodService as periodService} from "../Services/data/PeriodService.ts";
import {CreatePeriodSchema, PeriodIdPayloadSchema, UpdatePeriodSchema} from "../Validators/PeriodValidators.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";

export const deletePeriod = async (req, res) => {
    const payload = PeriodIdPayloadSchema.parse(req.query);

    const result = await periodService.deletePeriod(payload);
    return result ? res.status(422).send(false) : res.send(result);
};

export const getCurrentPeriod = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await periodService.getRunningPeriodForSchool(payload);
    if (result === null) {
        return res.status(204).send({label: null, startTime: null, endTime: null});
    }

    return res.status(200).send(result);
};

export const getNextPeriod = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await periodService.getNextRunningPeriodForSchool(payload);
    return res.status(200).send(result);
};

export const getPeriodById = async (req, res) => {
    const payload = PeriodIdPayloadSchema.parse(req.query);
    const result = await periodService.getPeriodByIdForSchool(payload);

    return res.status(200).send(result);
}

export const getAllPeriods = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await periodService.getAllPeriodsForSchool(payload);

    return res.send(result);
};

export const createPeriod = async (req, res) => {
    const payload = CreatePeriodSchema.parse({...req.body, ...req.query});
    const result = await periodService.createPeriod(payload);

    return res.send(result);
};

export const updatePeriod = async (req, res) => {
    const payload = UpdatePeriodSchema.parse({...req.body, ...req.query});
    const result = await periodService.updatePeriod(payload);

    return res.send(result);
};