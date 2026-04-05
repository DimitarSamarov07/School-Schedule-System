import {SchoolService as schoolService} from "../Services/data/SchoolService.ts";
import {CreateSchoolSchema, SchoolIdSchema, UpdateSchoolSchema} from "../Validators/SchoolValidators.ts";

export const getAllSchools = async (req, res) => {
    const result = await schoolService.getAllSchools();

    return res.send(result);
}

export const getSchoolById = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await schoolService.getSchoolById(payload);

    return res.send(result);
}

export const createSchool = async (req, res) => {
    const payload = CreateSchoolSchema.parse(req.body);
    const result = await schoolService.createSchool(payload);

    return res.send(result);
}

export const updateSchool = async (req, res) => {
    const payload = UpdateSchoolSchema.parse({...req.body, ...req.query});
    const result = await schoolService.updateSchoolById(payload);

    return res.send(result);

}

export const getUsersBySchoolId = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await schoolService.getUsersOfSchool(payload);

    return res.send(result);
}

export const getSchoolWorkWeekConfig = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await schoolService.getSchoolWorkWeekConfigById(payload);

    return res.send(result);
}