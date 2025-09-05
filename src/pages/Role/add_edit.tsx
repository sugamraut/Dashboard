import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  type DialogProps,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/Input_field";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { fetchAllPermissions } from "../../store/Permission/PermissionSlice";
import { createRole, updateRole } from "../../store/role/RoleSlice";
import { toast } from "react-toastify";

import { roleSchema } from "../../globals/ZodValidation";

import type z from "zod";
import type { Role } from "../../globals/typeDeclaration";

type FormData = z.infer<typeof roleSchema>;

interface AddEditProps {
  initialData?: Partial<FormData> & { id?: number; Permissions?: string[] };
  roleId?: number | null;
  onCancel?: () => void;
}

interface FormValues {
  name: string;
  displayName: string;
  permissions: Record<string, boolean>;
}

const ADDEDIT: React.FC<AddEditProps> = ({ initialData, roleId, onCancel }) => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(
    (state: RootState) => state.permissions.fulllist ?? []
  );
  const [_, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      displayName: "",
      permissions: {},
    },
  });

  const watchedPermissions = watch("permissions");

  useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (!initialData) return;

    reset({
      name: initialData.name ?? "",
      displayName: initialData.displayName ?? "",
      permissions: {},
    });

    const checkedMap: Record<string, boolean> = {};
    (initialData.Permissions ?? []).forEach((code: any) => {
      const permission = permissions.find((p) => p.code === code);
      const group = permission?.group;
      if (group) checkedMap[`${group}-${code}`] = true;
    });

    setValue("permissions", checkedMap);
  }, [initialData, permissions, reset, setValue]);

  const handleGroupCheck = (
    group: string,
    checkedValue: boolean,
    codes: string[]
  ) => {
    const updated = { ...watchedPermissions };
    codes.forEach((code) => {
      updated[`${group}-${code}`] = checkedValue;
    });
    setValue("permissions", updated);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const selectedPermissions = Object.entries(data.permissions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key.split("-")[1]);

    const payload: Role = {
      id: initialData?.id!,
      name: data.name,
      displayName: data.displayName,
      permission: selectedPermissions,
      isBranchUser: false,
      guardName: "",
    };

    try {
      if (initialData?.id) {
        await dispatch(
          updateRole({ ...payload, id: initialData.id! })
        ).unwrap();

        toast.success("Role updated successfully");
      } else {
        await dispatch(createRole(payload)).unwrap();
        toast.success("Role created successfully");
        reset();
      }
      onCancel?.();
    } catch (err: any) {
      toast.error(err?.toString() || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  const grouped = permissions.reduce((acc, perm) => {
    const group = perm.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const handleCancel = () => {
    reset({
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      permissions: (() => {
        const perms: Record<string, boolean> = {};
        initialData?.Permissions?.forEach((code: any) => {
          const perm = permissions.find((p) => p.code === code);
          if (perm?.group) perms[`${perm.group}-${code}`] = true;
        });
        return perms;
      })(),
    });

    onCancel?.();
  };

  const [scroll] = React.useState<DialogProps["scroll"]>("paper");
  const [open] = React.useState(false);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        {initialData?.id ? "Edit Role" : "Add Role"}
      </DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Box className="main-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: { value: true, message: "rew" } }}
                render={({ field }) => (
                  <InputField
                    label="name"
                    {...field}
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    fullWidth
                    margin="normal"
                  />
                )}
              />

              <Controller
                name="displayName"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <InputField
                    label="Display Name"
                    {...field}
                    error={!!errors.displayName}
                    helperText={errors?.displayName?.message}
                    fullWidth
                    margin="normal"
                  />
                )}
              />

              {Object.entries(grouped).map(([group, perms]) => {
                const name = perms.map((p) => p.name);
                const allChecked = name.every(
                  (code) => watchedPermissions[`${group}-${code}`]
                );
                const someChecked =
                  name.some((code) => watchedPermissions[`${group}-${code}`]) &&
                  !allChecked;

                return (
                  <Box key={group} mb={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allChecked}
                          indeterminate={someChecked}
                          onChange={(e) =>
                            handleGroupCheck(group, e.target.checked, name)
                          }
                        />
                      }
                      label={
                        <Typography fontSize={18} fontWeight={600}>
                          {group}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: "flex", flexWrap: "wrap", ml: 4 }}>
                      {perms.map((perm) => {
                        const key = `${group}-${perm.name}`;
                        return (
                          <Controller
                            key={key}
                            name={`permissions.${key}`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={!!field.value}
                                  />
                                }
                                label={
                                  <Typography fontSize={16} fontWeight={450}>
                                    {perm.name}
                                  </Typography>
                                }
                                sx={{ minWidth: 150 }}
                              />
                            )}
                          />
                        );
                      })}
                    </Box>
                    <hr />
                  </Box>
                );
              })}
            </form>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box mt={2} textAlign="end" gap={2}>
          <Button color="error" onClick={handleCancel} className="me-2">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "update" : "Submit"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ADDEDIT;
