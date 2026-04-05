import {z} from 'zod';

export const RoomIdPayloadSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreateRoomSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1, "Room name is required").max(100),
    floor: z.coerce.number().int().min(-10).max(200),
    capacity: z.coerce.number().int().positive().max(100, "Capacity seems unrealistically high")
});

export const UpdateRoomSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional().nullable(),
    floor: z.coerce.number().int().min(-10).max(200).optional().nullable(),
    capacity: z.coerce.number().int().positive().max(10000).optional().nullable()
});

export type RoomIdPayload = z.infer<typeof RoomIdPayloadSchema>;
export type CreateRoomPayload = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomPayload = z.infer<typeof UpdateRoomSchema>;