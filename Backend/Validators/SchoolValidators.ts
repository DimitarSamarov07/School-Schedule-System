import {z} from 'zod';

// Reusable day-of-week validator (1 = Monday, 7 = Sunday)
const WorkDaySchema = z.number().int().min(1).max(7);

export const SchoolIdSchema = z.object({
    schoolId: z.coerce.number().int().positive()
});

export const CreateSchoolSchema = z.object({
    name: z.string().trim().min(2).max(255),
    address: z.string().trim().min(5).max(500),
    workWeekConfig: z.array(WorkDaySchema).min(1).max(7)
});

export const UpdateSchoolSchema = SchoolIdSchema.extend({
    name: z.string().trim().min(2).max(255).optional().nullable(),
    address: z.string().trim().min(5).max(500).optional().nullable(),
    workWeekConfig: z.array(WorkDaySchema).min(1).max(7).optional().nullable()
});

export type SchoolIdPayload = z.infer<typeof SchoolIdSchema>;
export type CreateSchoolPayload = z.infer<typeof CreateSchoolSchema>;
export type UpdateSchoolPayload = z.infer<typeof UpdateSchoolSchema>;
