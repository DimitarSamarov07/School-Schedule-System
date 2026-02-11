import {RoomService as roomService} from "../Services/data/RoomService.ts";

export const createRoom = async (req, res) => {
    const {schoolId} = req.query;
    const {name, floor, capacity} = req.body;
    if (!name || !floor) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await roomService.createRoom(schoolId, name, floor, capacity);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const updateRoom = async (req, res) => {
    const {name, floor, id, capacity} = req.body;
    if ((!name && !floor) || !id) {
        return res.status(406).send("Malformed parameters");
    }

    try {
        const result = await roomService.updateRoom(id, name, floor, capacity);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const deleteRoom = async (req, res) => {
    const {id, schoolId} = req.query;
    if (!id || !schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await roomService.deleteRoom(id, schoolId);
        return result ? res.send(result) : res.status(422).send(false);
    } catch (err) {
        return res.status(500).send({error: err});
    }
};

export const getAllRooms = async (req, res) => {
    const {schoolId} = req.query;
    try {
        const result = await roomService.getAllRoomsForSchool(schoolId);
        return res.send(result);
    } catch (err) {
        const status = err === "No rooms found" ? 404 : 500;
        return res.status(status).send({error: err});
    }
};