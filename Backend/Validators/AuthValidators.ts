import {z} from 'zod';

// Reusable parts
const UsernameSchema = z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9._-]+$/,
    "Usernames can only contain letters, numbers, dots, underscores, and hyphens");

const PasswordSchema = z.string().min(8, "Password must be at least 8 characters long").max(100);

export const LoginSchema = z.object({
    username: UsernameSchema,
    password: PasswordSchema,
    deviceName: z.string().trim().min(3).max(255).optional()
});

export const CreateUserSchema = z.object({
    username: UsernameSchema,
    email: z.email("Invalid email address").max(255),
    password: PasswordSchema
});

export const UserPermissionSchema = z.object({
    userId: z.coerce.number().int().positive(),
    schoolId: z.coerce.number().int().positive()
});

export const AddUserToSchoolSchema = z.object({
    username: UsernameSchema,
    schoolId: z.coerce.number().int().positive()
});

export const ChangePasswordSchema = z.object({
    username: UsernameSchema,
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema
});

export const RefreshSchema = z.object({
    refreshToken: z.uuid()
});

export type LoginPayload = z.infer<typeof LoginSchema>;
export type CreateUserPayload = z.infer<typeof CreateUserSchema>;
export type UserPermissionPayload = z.infer<typeof UserPermissionSchema>;
export type AddUserToSchoolPayload = z.infer<typeof AddUserToSchoolSchema>;
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
export type RefreshPayload = z.infer<typeof RefreshSchema>;