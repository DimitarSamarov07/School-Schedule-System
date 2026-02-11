import {ClassService as classService} from "../Services/data/ClassService.ts";

export const getAllClasses = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await classService.getAllClassesForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        const status = err === "No classes found" ? 404 : 500;
        return res.status(status).send({"error": err});
    }
};

export const getClassById = async (req, res) => {
    const {id, schoolId} = req.query;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await classService.getClassByIdForSchool(id, schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}

export const createClass = async (req, res) => {
    const {schoolId} = req.query;
    const {name, description, homeRoomId} = req.body;
    if (!schoolId || !name || !description || !homeRoomId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await classService.createClass(schoolId, name, description, homeRoomId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};

export const updateClass = async (req, res) => {
    const {schoolId} = req.query;
    const {name, description, homeRoomId, id} = req.body;

    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await classService.updateClass(id, schoolId, name, description, homeRoomId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};

export const deleteClass = async (req, res) => {
    const {id, schoolId} = req.query;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await classService.deleteClass(id, schoolId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};