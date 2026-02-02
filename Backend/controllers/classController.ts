import {ClassService as classService} from "../Services/data/ClassService.ts";

export const updateClass = async (req, res) => {
    const {name, homeRoomId, id} = req.body;

    if ((!name && !homeRoomId) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await classService.updateClass(id, name, homeRoomId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};

export const deleteClass = async (req, res) => {
    const {id} = req.query;
    try {
        const result = await classService.deleteClass(id);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};

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

export const createClass = async (req, res) => {
    const {schoolId} = req.query;
    const {name, description} = req.body;
    if (!name || !description) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await classService.createClass(schoolId, name, description);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err.message || err});
    }
};