import {RoomService as roomService} from "../Services/data/RoomService.ts";
import {CreateRoomSchema, RoomIdPayloadSchema, UpdateRoomSchema} from "../Validators/RoomValidators.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";

export const createRoom = async (req, res) => {
    const payload = CreateRoomSchema.parse({...req.body, ...req.query});
    const result = await roomService.createRoom(payload);

    return res.send(result);
};

export const updateRoom = async (req, res) => {
    const payload = UpdateRoomSchema.parse({...req.body, ...req.query});
    const result = await roomService.updateRoom(payload);

    return res.send(result);

};

export const deleteRoom = async (req, res) => {
    const payload = RoomIdPayloadSchema.parse(req.query);
    const result = await roomService.deleteRoom(payload);

    return result ? res.send(result) : res.status(422).send(false);
};

export const getAllRooms = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await roomService.getAllRoomsForSchool(payload);

    return res.send(result);
};

export const getRoomById = async (req, res) => {
    const payload = RoomIdPayloadSchema.parse(req.query);
    const result = await roomService.getRoomByIdForSchool(payload);

    return res.send(result);
};