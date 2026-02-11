import {TeacherService as teacherService} from "../Services/data/TeacherService.ts";

export const getAllTeachers = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await teacherService.getAllTeachersForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const getTeacherById = async (req, res) => {
    const {id, schoolId} = req.query;

    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await teacherService.getTeacherByIdForSchool(id, schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const createTeacher = async (req, res) => {
    const {schoolId} = req.query;
    const {firstName, lastName} = req.body;
    if (!firstName || !lastName) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await teacherService.createTeacher(schoolId, firstName, lastName);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const updateTeacher = async (req, res) => {
    const {schoolId} = req.query;
    const {name, email, id} = req.body;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await teacherService.updateTeacher(id, schoolId, name, email);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const deleteTeacher = async (req, res) => {
    const {id, schoolId} = req.query;
    try {
        const result = await teacherService.deleteTeacher(id, schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};