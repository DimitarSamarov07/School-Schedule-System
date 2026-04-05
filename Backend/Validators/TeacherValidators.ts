import {z} from 'zod';

export const TeacherIdPayloadSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreateTeacherSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(2, "Teacher name must be at least 2 characters").max(150),
    email: z.email("Invalid email address format").trim().max(255)
});

export const UpdateTeacherSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(2).max(150).optional().nullable(),
    email: z.email().max(255).trim().optional().nullable()
});

export type TeacherIdPayload = z.infer<typeof TeacherIdPayloadSchema>;
export type CreateTeacherPayload = z.infer<typeof CreateTeacherSchema>;
export type UpdateTeacherPayload = z.infer<typeof UpdateTeacherSchema>;