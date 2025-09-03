

import { z } from "zod";


export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(15, "Password is too long"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const userSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    // email: z.string().email("Invalid email address"),
    email:z.email({pattern:z.regexes.email}),
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



export const BranchSchema = z.object({
  branchName: z.string().min(1, "Branch Name is required"),
  code: z.string().min(1, "Code is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
});


 export const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  nameNp: z.string().min(1, "City name in Nepali is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
});

export const permissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Permission name is required"),
  displayName: z.string().min(1, "Display name is required"),
  displayNameNp: z.string().min(1, "Display name in Nepali is required"),
  group: z.string().min(1, "Group is required"),
  ActionGroups: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(1, "At least one action group must be selected"),
});

export const roleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Role name is required"),
  displayName: z.string().min(1, "Display name is required"),
  Permissions: z
    .array(z.string())
    .min(1, "At least one permission must be selected"),
});

export const districtSchema = z.object({
  name: z.string().min(1, "District name is required"),
  nameNp: z.string().optional(),
  state: z.string().min(1, "State is required"),
});

export type DistrictFormData = z.infer<typeof districtSchema>;

export const stateSchema = z.object({
  name: z.string().min(1, "State name is required"),
  nameNp: z.string().optional(),
  code: z.string().min(1, "State code is required"),
});

export type StateFormData = z.infer<typeof stateSchema>;

export const settingSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
});

export type SettingFormData = z.infer<typeof settingSchema>;

export const AccountSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "title is required"),
  code: z.string().min(1, "code is required"),
  interest: z.string().min(1, "interest is required"),
  description: z.string().min(1, "description is required"),
  minimumblance: z.string().min(1,"minimumbalance is required"),
  imageUrl: z.string().optional(),
  originalName:z.string().min(1,"orginalname is required"),
});

export type Account = z.infer<typeof AccountSchema>;

export const  ProfileSchema=z.object({
  id:z.number().optional(),
  name:z.string().min(1,"Name is required"),
  username:z.string().min(1,"UserName is required"),
   email:z.email({pattern:z.regexes.email}),
   mobilenumber:z.string().optional(),
   password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(15, "Password is too long"),
  confirmPassword:z.string().min(1,"confirm password must be provided")
});

export type ProfileFormData = z.infer<typeof ProfileSchema>