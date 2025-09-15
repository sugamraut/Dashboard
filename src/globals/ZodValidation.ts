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
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .regex(/^\d{10,}$/, "Mobile number must contain only digits"),
    email: z.email({ pattern: z.regexes.html5Email }),
    username: z.string().min(1, "Username is required"),
    gender: z.enum(["Male", "Female", "Other"], {
      message: "Gender is required",
    }),
    role: z.string().min(1, "Role is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must include at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;

export const BranchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Code must be alphanumeric with optional hyphens"
    ),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
});

export type BranchDataState = z.infer<typeof BranchSchema>;

export const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  nameNp: z
    .string()
    .min(1, "City name in Nepali is required")
    .regex(
      /^[\u0900-\u097F\s]+$/,
      "City name in Nepali must use Devanagari script"
    ),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
});

export type CityFormData = z.infer<typeof citySchema>;

export const permissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Permission name is required"),
  displayName: z.string().min(1, "Display name is required"),
  displayNameNp: z
    .string()
    .min(1, "Display name in Nepali is required")
    .regex(
      /^[\u0900-\u097F\s]+$/,
      "Display name in Nepali must use Devanagari script"
    ),
  group: z.string().min(1, "Group is required"),
  // group:z.array(z.object({name:z.string().min(1,"group name is requier")})),
  ActionGroups: z
    .array(
      z.object({
        id: z.number().int("Action group ID must be an integer"),
        name: z.string().min(1, "Action group name is required"),
      })
    )
    .min(1, "At least one action group must be selected"),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Role name is required"),
  displayName: z.string().min(1, "Display name is required"),
  Permissions: z
    .array(z.string().min(1, "Permission cannot be empty"))
    .min(1, "At least one permission must be selected"),
});

export type RoleFormData = z.infer<typeof roleSchema>;

export const districtSchema = z.object({
  name: z.string().min(1, "District name is required"),
  nameNp: z
    .string()
    .optional()
    .refine((val) => !val || val.match(/^[\u0900-\u097F\s]+$/), {
      message: "District name in Nepali must use Devanagari script",
    }),
  state: z.string().min(1, "State is required"),
});

export type DistrictFormData = z.infer<typeof districtSchema>;
export const stateSchema = z.object({
  name: z.string().min(1, "State name is required"),
  nameNp: z
    .string()
    .optional()
    .refine((val) => !val || val.match(/^[\u0900-\u097F\s]+$/), {
      message: "State name in Nepali must use Devanagari script",
    }),
  code: z
    .string()
    .min(1, "State code is required")
    .regex(/^[A-Za-z0-9-]+$/, "State code must be alphanumeric "),
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
  title: z.string().min(1, "Title is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Code must be alphanumeric with optional hyphens"
    ),
  interest: z
    .string()
    .min(1, "Interest rate is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Interest rate must be a valid number "),
  description: z.string().min(1, "Description is required"),
  minBalance: z
    .string()
    .min(1, "Minimum balance is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Minimum balance must be a valid number "),
  imageUrl: z.string().url("Invalid URL").optional(),
  originalName: z.string().min(1, "Original name is required"),
});

export type Account = z.infer<typeof AccountSchema>;

export const ProfileSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.email({ pattern: z.regexes.html5Email }),
    mobile: z
      .string()
      .optional()
      .refine((val) => !val || val.match(/^\d{10,}$/), {
        message:
          "Mobile number must be at least 10 digits and contain only digits",
      }),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(15, "Password cannot exceed 15 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must include at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(15, "Confirm password cannot exceed 15 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileFormData = z.infer<typeof ProfileSchema>;
