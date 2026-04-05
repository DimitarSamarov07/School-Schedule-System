import {HolidayService as holidayService} from "../Services/data/HolidayService.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";
import {CreateHolidaySchema, HolidayIdPayloadSchema, UpdateHolidaySchema} from "../Validators/HolidayValidators.ts";

export const getAllHolidays = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query)
    const result = await holidayService.getAllHolidaysForSchool(payload);

    return res.send(result);
};

export const getHolidayById = async (req, res) => {
    const payload = HolidayIdPayloadSchema.parse(req.query)
    const result = await holidayService.getHolidayById(payload);
    return res.send(result);
}

export const createHoliday = async (req, res) => {
    const payload = CreateHolidaySchema.parse({...req.query, ...req.body});
    const result = await holidayService.createHolidayForSchool(payload);

    return res.send(result);
}

export const updateHoliday = async (req, res) => {
    const payload = UpdateHolidaySchema.parse({...req.query, ...req.body});
    const result = await holidayService.updateHolidayForSchool(payload);

    return res.send(result);

}

export const deleteHoliday = async (req, res) => {
    const payload = HolidayIdPayloadSchema.parse({...req.query});
    const result = await holidayService.deleteHolidayForSchool(payload);

    return res.second(result);
}