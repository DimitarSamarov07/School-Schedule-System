import {ClassService as classService} from "../Services/data/ClassService.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";
import {ClassIdSchema, CreateClassSchema, UpdateClassSchema} from "../Validators/ClassValidators.ts";

export const getAllClasses = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await classService.getAllClassesForSchool(payload);

    return res.send(result);
};

export const getClassById = async (req, res) => {
    const payload = ClassIdSchema.parse(req.query);
    const result = await classService.getClassByIdForSchool(payload);

    return res.send(result);
}

export const createClass = async (req, res) => {
    const payload = CreateClassSchema.parse({...req.body, ...req.query});
    const result = await classService.createClass(payload);

    return res.send(result);
};

export const updateClass = async (req, res) => {
    const payload = UpdateClassSchema.parse({...req.body, ...req.query});
    const result = await classService.updateClass(payload);

    return res.send(result);
};

export const deleteClass = async (req, res) => {
    const payload = ClassIdSchema.parse(req.query);
    const result = await classService.deleteClass(payload);

    return result ? res.send(result) : res.status(422).send(false);
};