import {SubjectService as subjectService} from "../Services/data/SubjectService.ts";

export const getAllSubjects = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await subjectService.getAllSubjectsForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        const status = err === "No subjects found" ? 404 : 500;
        return res.status(status).send({"error": err});
    }
}

export const getSubjectById = async (req, res) => {
    const {id, schoolId} = req.query;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await subjectService.getSubjectByIdForSchool(id, schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}

export const createSubject = async (req, res) => {
    const {schoolId} = req.query;
    const {name, description} = req.body;

    if (!name || !description || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await subjectService.createSubject(schoolId, name, description);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const deleteSubject = async (req, res) => {
    const {id, schoolId} = req.query;

    try {
        const result = await subjectService.deleteSubject(id, schoolId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};

export const updateSubject = async (req, res) => {
    const {schoolId} = req.query;
    const {name, description, id} = req.body;

    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await subjectService.updateSubject(id, schoolId, name, description);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
};