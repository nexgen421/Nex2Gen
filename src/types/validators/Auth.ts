import { z } from 'zod';

export const RegisterValidator = z.object({
    firstName: z.string(), 
    lastName: z.string(),
    email: z.string().email(),
    mobile: z.string(),
    password: z.string(),
    confirmPassword: z.string()
});

export type TRegisterValidator = z.infer<typeof RegisterValidator>;

