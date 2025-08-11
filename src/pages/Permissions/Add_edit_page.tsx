import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Chip, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  fetchPermissionsByGroup,
  updatePermission,
  addPermission,
  fetchAllPermissions,
} from "../../store/Permission/permissionSlice";

interface GroupOption {
  label: string;
  id: string;
}

interface AddEditPageProps {
  initialData?: {
    id?: number;
    name: string;
    displayName: string;
    displayNameNp?: string;
    group?: string;
  } | null;
  onClose: () => void;
}

interface FormValues {
  id?: number;
  name: string;
  displayName: string;
  displayNameNp: string;
  group: GroupOption | null;
  extraGroups: { title: string; year: number }[];
}
const defaultValues: FormValues = {
  id: undefined,
  name: "",
  displayName: "",
  displayNameNp: "",
  group: null,
  extraGroups: [],
};

const AddEditPage: React.FC<AddEditPageProps> = ({ initialData, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  
  const [formData, setFormData] = useState<FormValues>({
    ...defaultValues,
    displayName: initialData?.displayName || "",
    displayNameNp: initialData?.displayNameNp || "",
  });

  const [localError, setLocalError] = useState<string | null>(null);
 const { groupedPermissions, extraGroupsData } = useSelector(
  (state: RootState) => state.permissions
);

  console.log(groupedPermissions);
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      displayNameNp: initialData?.displayNameNp || "",
      group: initialData?.group || undefined,
      extraGroups: [],
    },
  });
  useEffect(() => {
  dispatch(fetchPermissionsByGroup());
  dispatch(fetchAllPermissions());
}, [dispatch]);

  useEffect(() => {
    if (initialData?.group && groupedPermissions.length > 0) {
      const matched = groupedPermissions.find(
        (g: { label: string | undefined; id: number | undefined }) =>
          g.label === initialData.group || g.id === initialData.group
      );
      if (matched) {
        setValue("group", matched);
      }
    }
  }, [initialData, groupedPermissions, setValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName) {
      setLocalError("Display Name is required");
      return;
    }

    try {
      if (initialData?.id) {
        // Editing
        await dispatch(
          updatePermission({
            id: initialData.id,
            name: formData.name,
            displayName: formData.displayName,
            displayNameNp: formData.displayNameNp,
            group: formData.group?.label || "",
            guardName: "", // add actual value if required
            label: formData.displayName,
          })
        ).unwrap();
      } else {
        // Adding
        await dispatch(
          addPermission({
            id: 0, // backend will ignore
            name: formData.name,
            displayName: formData.displayName,
            displayNameNp: formData.displayNameNp,
            group: formData.group?.label || "",
            guardName: "",
            label: formData.displayName,
          })
        ).unwrap();
      }
      onClose();
    } catch (error) {
      setLocalError(String(error));
    }
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      group: data.group?.label || "",
      extraGroups: data.extraGroups.map((g) => g.title),
    };
    // console.log("Form submitted:", payload);
    onClose();
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <TextField
        label="Display Name"
        fullWidth
        margin="normal"
        {...register("displayName", { required: "Display name is required" })}
        error={!!errors.displayName}
        helperText={errors.displayName?.message}
      />

      <TextField
        label="Display Name (Nepali)"
        fullWidth
        margin="normal"
        {...register("displayNameNp")}
      />

      <Controller
        control={control}
        name="group"
        render={({ field }) => (
          <Autocomplete
            disablePortal
            options={groupedPermissions}
            // getOptionLabel={(option) => option.label}
            value={field.value}
            onChange={(_, data) => field.onChange(data)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group"
                margin="normal"
                error={!!errors.group}
                helperText={errors.group?.message as string}
              />
            )}
          />
        )}
      />

 <Controller
  control={control}
  name="extraGroups"
  render={({ field }) => (
    <Autocomplete
      multiple
      options={extraGroupsData}
      getOptionLabel={(option) => option.displayName} 
      value={field.value}
      onChange={(_, data) => field.onChange(data)}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.displayName} // or option.name
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Action type" margin="normal" />
      )}
    />
  )}
/>


      <Box mt={3} textAlign="right">
        <Button color="error" sx={{ mr: 2 }} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          {initialData ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditPage;
