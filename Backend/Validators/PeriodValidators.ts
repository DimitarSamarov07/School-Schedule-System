import {z} from 'zod';
import moment from 'moment';

const TimeStringSchema = z.iso.time({error: "Time should be in format HH:mm:ss", precision: 0})

export const PeriodIdPayloadSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreatePeriodSchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1, "Period name is required").max(100),
    startTime: TimeStringSchema,
    endTime: TimeStringSchema
}).refine((data) => {
    const start = moment(data.startTime, 'HH:mm:ss');
    const end = moment(data.endTime, 'HH:mm:ss');
    return end.isAfter(start);
}, {
    message: "End time must be after start time",
    path: ["endTime"]
});

export const UpdatePeriodSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(100).optional().nullable(),
    startTime: TimeStringSchema.optional().nullable(),
    endTime: TimeStringSchema.optional().nullable()
}).refine((data) => {
    // Only compare if both times are provided
    if (data.startTime && data.endTime) {
        const start = moment(data.startTime, 'HH:mm:ss');
        const end = moment(data.endTime, 'HH:mm:ss');
        return end.isAfter(start);
    }
    return true;
}, {
    message: "End time must be after start time",
    path: ["endTime"]
});

export type PeriodIdPayload = z.infer<typeof PeriodIdPayloadSchema>;
export type CreatePeriodPayload = z.infer<typeof CreatePeriodSchema>;
export type UpdatePeriodPayload = z.infer<typeof UpdatePeriodSchema>;