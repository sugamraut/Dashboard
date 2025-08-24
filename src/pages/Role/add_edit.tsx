import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/Input_field";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { fetchAllPermissions } from "../../store/Permission/PermissionSlice";
import { createRole, updateRole } from "../../store/role/RoleSlice";
import { toast } from "react-toastify";

interface AddEditProps {
  roleId?: number | null;
  initialData?: {
    name?: string;
    displayName?: string;
    Permissions?: string[];
  } | null;
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
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset, watch, setValue } = useForm<FormValues>(
    {
      defaultValues: {
        name: "",
        displayName: "",
        permissions: {},
      },
    }
  );

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
    initialData.Permissions?.forEach((code) => {
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

    const payload = {
      name: data.name,
      displayName: data.displayName,
      permissions: selectedPermissions,
    };

    try {
      if (roleId) {
        await dispatch(updateRole({ id: roleId, data: payload })).unwrap();
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
        initialData?.Permissions?.forEach((code) => {
          const perm = permissions.find((p) => p.code === code);
          if (perm?.group) perms[`${perm.group}-${code}`] = true;
        });
        return perms;
      })(),
    });

    onCancel?.(); 
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Code is required" }}
          render={({ field, fieldState }) => (
            <InputField
              label="Code"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="displayName"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <InputField
              label="Name"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              margin="normal"
            />
          )}
        />

        {Object.entries(grouped).map(([group, perms]) => {
          const codes = perms.map((p) => p.name);
          const allChecked = codes.every(
            (code) => watchedPermissions[`${group}-${code}`]
          );
          const someChecked =
            codes.some((code) => watchedPermissions[`${group}-${code}`]) &&
            !allChecked;

          return (
            <Box key={group} mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={(e) =>
                      handleGroupCheck(group, e.target.checked, codes)
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
                            <Checkbox {...field} checked={!!field.value} />
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

        <Box mt={2} display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : roleId ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ADDEDIT;
