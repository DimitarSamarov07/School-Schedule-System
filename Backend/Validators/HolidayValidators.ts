import {z} from 'zod';
import moment from "moment";

export const HolidayIdPayloadSchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const CreateHolidaySchema = z.object({
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(2, "Holiday name is required").max(150),
    startDate: z.iso.date("Invalid start date format. Expected YYYY-MM-DD"),
    endDate: z.iso.date("Invalid end date format. Expected YYYY-MM-DD")
}).refine((data) => {
    const start = moment(data.startDate, 'YYYY-MM-DD');
    const end = moment(data.endDate, 'YYYY-MM-DD');

    return end.isSameOrAfter(start);
}, {
    message: "End date cannot be before start date",
    path: ["endDate"]
});

export const UpdateHolidaySchema = z.object({
    id: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive(),
    name: z.string().trim().min(2).max(150).optional().nullable(),
    startDate: z.string().date().optional().nullable(),
    endDate: z.string().date().optional().nullable()
}).refine((data) => {
    // Only check date logic if both dates are provided in the update
    if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
}, {
    message: "End date cannot be before start date",
    path: ["endDate"]
});

export type HolidayIdPayload = z.infer<typeof HolidayIdPayloadSchema>;
export type CreateHolidayPayload = z.infer<typeof CreateHolidaySchema>;
export type UpdateHolidayPayload = z.infer<typeof UpdateHolidaySchema>;