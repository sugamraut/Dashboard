import React, { useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { AppDispatch, RootState } from "../../store/store";
import {
  fetchPermissionsByGroup,
  updatePermission,
  addPermission,
  fetchAllPermissions,
} from "../../store/Permission/PermissionSlice";
import type { Permission } from "../../globals/typeDeclaration";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import {
  permissionSchema,
  type PermissionFormData,
} from "../../globals/ZodValidation";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../components/Input_field";

type FormData = z.infer<typeof permissionSchema>;
interface AddEditPageProps {
  initialData?: Partial<FormData> & { id?: number };
  onClose?: () => void;
}

const AddEditPage: React.FC<AddEditPageProps> = ({ initialData, onClose }) => {
  const dispatch = useAppDispatch<AppDispatch>();
  // const [_, setLocalError] = useState<string | null>(null);

  const { groupedPermissions, ActionData } = useAppSelector(
    (state: RootState) => state.permissions
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      id: initialData?.id || 0,
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      displayNameNp: initialData?.displayNameNp || "",
      group: initialData?.group || "",
      ActionGroups: initialData?.ActionGroups ?? [],
    },
  });

  useEffect(() => {
    dispatch(fetchPermissionsByGroup());
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  const onSubmit = async (data: PermissionFormData) => {
    if (!data.displayName) {
      toast.error("Display Name is required");
      return;
    }

    try {
      const payload = {
        id: data.id ?? 0,
        displayName: data.displayName,
        displayNameNp: data.displayNameNp,
        group: data.group ?? "",
        guardName: "",
        label: data.displayName,
        name: (data.ActionGroups?.map((g) => g.name) || []).join(","),
      };

      if (initialData?.id) {
        await dispatch(
          updatePermission({
            ...payload,
            id: initialData.id,
            code: null,
          })
        ).unwrap();

        toast.success("Permission updated successfully");
      } else {
        await dispatch(addPermission(payload)).unwrap();

        toast.success("Permission created successfully");
      }

      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save permission");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md">
      <DialogTitle>
        {initialData?.id ? "Edit Permission" : "Add City"}
      </DialogTitle>
      <DialogContent dividers>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Display Name"
                fullWidth
                margin="normal"
                error={!!errors.displayNameNp}
                helperText={errors?.displayNameNp?.message}
              />
            )}
          />

          <Controller
            name="displayNameNp"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={field.value ?? ""}
                label="Display Name (Nepali)"
                fullWidth
                margin="normal"
                {...register("displayNameNp", {
                  required: "Display name in Nepali is required",
                })}
                error={!!errors.displayNameNp}
                helperText={errors?.displayNameNp?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="group"
            render={({ field }) => (
              <Autocomplete<Permission>
                disablePortal
                options={groupedPermissions}
                onChange={(_, data) => field.onChange(data)}
                value={
                  groupedPermissions.find(
                    (perm) => perm.name === field.value
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group"
                    margin="normal"
                    {...register("group")}
                    error={!!errors.group}
                    helperText={errors?.group?.message as string}
                  />
                )}
              />
            )}
          />


          <Controller
            control={control}
            name="ActionGroups"
            render={({ field }) => (
              <Autocomplete
                multiple
                options={Array.isArray(ActionData) ? ActionData : []} 
                getOptionLabel={(option) => option.name || ""}
                value={field.value || []}
                onChange={(_, data) => field.onChange(data)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Action type"
                    margin="normal"
                    error={!!errors.ActionGroups}
                    helperText={errors?.ActionGroups?.message as string}
                  />
                )}
              />
            )}
          />

          <DialogActions sx={{ mt: 2 }}>
            <Button color="error" sx={{ mr: 2 }} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {initialData ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPage;
