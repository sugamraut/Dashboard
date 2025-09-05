import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hook";
import { createSetting, updateSetting } from "../../store/setting/SettingSlice";
import { toast } from "react-toastify";
import InputField from "../../components/Input_field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  settingSchema,
  type SettingFormData,
} from "../../globals/ZodValidation";

interface AddEditProps {
  initialData?: SettingFormData | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ADDEDIT = ({ initialData, onSuccess, onCancel }: AddEditProps) => {
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: "",
      description: "",
      value: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (formData: SettingFormData) => {
    try {
      if (initialData?.id) {
        await dispatch(
          updateSetting({
            id: String(initialData.id),
            updatedData: formData,
          }) as any
        ).unwrap();
        toast.success("Setting updated successfully");
      } else {
        await dispatch(createSetting(formData)).unwrap();
        toast.success("Setting created successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(`Failed to save setting: ${err}`);
    }
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData?.id ? "Edit Setting" : "Add Setting"}
      </DialogTitle>
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            padding: "0px",
          },
        }}
      >
        <hr />
        <form className="main-container" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputField
                label="Name"
                {...field}
                error={!!errors.name}
                helperText={errors?.name?.message}
                fullWidth
                margin="normal"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <InputField
                label="Description"
                {...field}
                value={field.value ?? ""}
                error={!!errors.description}
                helperText={errors?.description?.message}
                fullWidth
                margin="normal"
              />
            )}
          />

          <Controller
            control={control}
            name="value"
            render={({ field }) => (
              <TextField
                label="Value"
                {...field}
               error={!!errors.value}
               helperText={errors?.value?.message}
                fullWidth
                required
                margin="normal"
                multiline
                minRows={4}
              />
            )}
          />

          <hr />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="error" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" color="primary">
              {initialData ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ADDEDIT;
