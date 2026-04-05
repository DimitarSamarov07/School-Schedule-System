import {z} from 'zod';

export const ClassIdSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreateClassSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1, "Class name is required").max(100),
    description: z.string().trim().max(500).nullable().optional(),
    homeRoomId: z.coerce.number().int().positive()
});

export const UpdateClassSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional().nullable(),
    description: z.string().trim().max(500).optional().nullable(),
    homeRoomId: z.coerce.number().int().positive().optional().nullable()
});

export type ClassIdPayload = z.infer<typeof ClassIdSchema>;
export type CreateClassPayload = z.infer<typeof CreateClassSchema>;
export type UpdateClassPayload = z.infer<typeof UpdateClassSchema>;