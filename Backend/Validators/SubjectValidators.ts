import {z} from 'zod';

export const SubjectIdPayloadSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreateSubjectSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1, "Subject name is required").max(100),
    description: z.string().trim().max(500).default("") // Keeps descriptions from getting too crazy
});

export const UpdateSubjectSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional().nullable(),
    description: z.string().trim().max(500).optional().nullable(),
});

export type SubjectIdPayload = z.infer<typeof SubjectIdPayloadSchema>;
export type CreateSubjectPayload = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectPayload = z.infer<typeof UpdateSubjectSchema>;