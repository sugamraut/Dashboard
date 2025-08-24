
import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    mobilenumber: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    gender: z.string().nonempty("Gender is required"),
    role: z.string().nonempty("Role is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;
