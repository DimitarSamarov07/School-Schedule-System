import {TeacherService as teacherService} from "../Services/data/TeacherService.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";
import {CreateTeacherSchema, TeacherIdPayloadSchema, UpdateTeacherSchema} from "../Validators/TeacherValidators.ts";

export const getAllTeachers = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await teacherService.getAllTeachersForSchool(payload);

    return res.send(result);
};

export const getTeacherById = async (req, res) => {
    const payload = TeacherIdPayloadSchema.parse(req.query);
    const result = await teacherService.getTeacherByIdForSchool(payload);

    return res.send(result);
};

export const createTeacher = async (req, res) => {
    const payload = CreateTeacherSchema.parse({...req.body, ...req.query});
    const result = await teacherService.createTeacher(payload);

    return res.send(result);
};

export const updateTeacher = async (req, res) => {
    const payload = UpdateTeacherSchema.parse({...req.body, ...req.query});
    const result = await teacherService.updateTeacher(payload);

    return res.send(result);
};

export const deleteTeacher = async (req, res) => {
    const payload = TeacherIdPayloadSchema.parse(req.query);
    const result = await teacherService.deleteTeacher(payload);

    return res.send(result);
};