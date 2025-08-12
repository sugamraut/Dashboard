import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button,TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  fetchPermissionsByGroup,
  updatePermission,
  addPermission,
  fetchAllPermissions,
  type Permission,
} from "../../store/Permission/permissionSlice";

interface GroupOption {
  label: string;
  id: string | number;
}

interface ExtraGroupOption {
  name: any;
  id: number;
  title: string;
  displayName: string;
  displayNameNp: string;
  group: string;
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
  extraGroups: ExtraGroupOption[];
}

const AddEditPage: React.FC<AddEditPageProps> = ({ initialData, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [localError, setLocalError] = useState<string | null>(null);

  const { groupedPermissions, extraGroupsData } = useSelector(
    (state: RootState) => state.permissions
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      displayName: initialData?.displayName || "",
      displayNameNp: initialData?.displayNameNp || "",
      group: null,
      extraGroups: [],
    },
  });
  // console.log(extraGroupsData)

  useEffect(() => {
    dispatch(fetchPermissionsByGroup());
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (initialData?.group && groupedPermissions.length > 0) {
      const matched = groupedPermissions.find(
        (g: { label: string | undefined; id: string | number | undefined }) =>
          g.label === initialData.group || g.id === initialData.group
      );
      if (matched) {
        setValue("group", matched);
      }
    }
  }, [initialData, groupedPermissions, setValue]);

  const onSubmit = async (data: FormValues) => {
    setLocalError(null);
    console.log("===>" + data);
    if (!data.displayName) {
      setLocalError("Display Name is required");
      return;
    }

    try {
      const payload = {
        id: data.id ?? 0,
        name: data.name,
        displayName: data.displayName,
        displayNameNp: data.displayNameNp,
        group: data.group?.label || "",
        guardName: "",
        label: data.displayName,
        extraGroups: data.extraGroups.map((g) => g.name),
      };

      if (initialData?.id) {
        await dispatch(
          updatePermission({ ...payload, id: initialData.id })
        ).unwrap();
      } else {
        await dispatch(addPermission(payload)).unwrap();
      }

      onClose();
    } catch (error) {
      setLocalError(String(error));
    }
  };

  console.log(extraGroupsData);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
          <Autocomplete<Permission>
            disablePortal
            options={groupedPermissions}
            // getOptionLabel={(option) => option.name}
            onChange={(_, data) => field.onChange(data)}
            value={field.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group"
                margin="normal"
                {...register("group")}
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
            options={Array.isArray(extraGroupsData) ? extraGroupsData : []}
            getOptionLabel={(option) => option?.name}
            // value={field.value}
            onChange={(_, data) => field.onChange(data)}
            // renderTags={(value, getTagProps) =>
            //   value.map((option, index) => (
            //     <Chip
            //       label={option.name || option.displayName}
            //       {...getTagProps({ index })}
            //       key={option.id}
            //     />
            //   ))
            // }
            renderInput={(params) => (
              <TextField {...params} label="Action type" margin="normal" />
            )}
          />
        )}
      />

      {/* {localError && (
        <Box mt={1} color="error.main">
          {localError}
        </Box>
      )} */}

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
