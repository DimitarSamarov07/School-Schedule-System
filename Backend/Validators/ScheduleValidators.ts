import {z} from 'zod';

export const BaseScheduleSchema = z.object({
    periodId: z.coerce.number().int().positive(),
    classId: z.coerce.number().int().positive(),
    teacherId: z.coerce.number().int().positive(),
    subjectId: z.coerce.number().int().positive(),
    roomId: z.coerce.number().int().positive(),
});

export const CreateScheduleQuerySchema = BaseScheduleSchema.extend({
    schoolId: z.coerce.number().int().positive(),
    date: z.iso.date()
});

export const BulkCreateScheduleQuerySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    startDate: z.iso.date("The date format required is YYYY-MM-DD"),
    endDate: z.iso.date("The date format required is YYYY-MM-DD"),
    dayOfWeek: z.number().int().min(1).max(7),
    schedules: z.array(BaseScheduleSchema).min(1).max(500)
});

export const BulkDeleteScheduleQuerySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    startDate: z.iso.date("The date format required is YYYY-MM-DD"),
    endDate: z.iso.date("The date format required is YYYY-MM-DD"),
    dayOfWeek: z.number().int().min(1).max(7).optional() // If no dayOfWeek is provided, delete all schedules for the entire week
});

export const UpdateScheduleQuerySchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    date: z.iso.date("The date format required is YYYY-MM-DD").nullable().optional(),
    periodId: z.coerce.number().int().positive().nullable().optional(),
    classId: z.coerce.number().int().positive().nullable().optional(),
    teacherId: z.coerce.number().int().positive().nullable().optional(),
    subjectId: z.coerce.number().int().positive().nullable().optional(),
    roomId: z.coerce.number().int().positive().nullable().optional(),
});

export const DateRangeScheduleQuerySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    startDate: z.iso.date("The date format required is YYYY-MM-DD"),
    endDate: z.iso.date("The date format required is YYYY-MM-DD"),
});

export const DateAndTimeScheduleQuerySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    date: z.iso.date("The date format required is YYYY-MM-DD"),
    time: z.iso.time({error: "Time should be in format HH:mm:ss", precision: 0})
});

export const DateQueryScheduleSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    date: z.iso.date("The date format required is YYYY-MM-DD"),
});

export const ClassDateScheduleQuerySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    classId: z.coerce.number().int().positive(),
    date: z.iso.date("The date format required is YYYY-MM-DD")
});

export type CreateSchedulePayload = z.infer<typeof CreateScheduleQuerySchema>;
export type BulkCreateSchedulePayload = z.infer<typeof BulkCreateScheduleQuerySchema>;
export type BulkDeleteSchedulePayload = z.infer<typeof BulkDeleteScheduleQuerySchema>;
export type UpdateSchedulePayload = z.infer<typeof UpdateScheduleQuerySchema>;
export type DateRangeScheduleQueryPayload = z.infer<typeof DateRangeScheduleQuerySchema>;
export type DateAndTimeScheduleQueryPayload = z.infer<typeof DateAndTimeScheduleQuerySchema>;
export type ClassDateScheduleQueryPayload = z.infer<typeof ClassDateScheduleQuerySchema>;
export type DateQuerySchedulePayload = z.infer<typeof DateQueryScheduleSchema>;