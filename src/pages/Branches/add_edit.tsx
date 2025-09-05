import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BranchSchema,
  type BranchDataState,
} from "../../globals/ZodValidation";
import InputField from "../../components/Input_field";

interface BranchFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: BranchDataState | null;
  onSubmit: (data: BranchDataState) => Promise<void>;
  states: string[];
  districts: string[];
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  states,
  districts,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchDataState>({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      branchName: "",
      code: "",
      state: "",
      district: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        branchName: "",
        code: "",
        state: "",
        district: "",
      });
    }
  }, [initialData, open, reset]);

  const onFormSubmit = async (data: BranchDataState) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          margin: "auto",
          mt: 5,
          p: 4,
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          {initialData ? "Edit Branch" : "Add Branch"}
        </Typography>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Controller
            name="branchName"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Branch Name"
                fullWidth
                margin="normal"
                error={!!errors.branchName}
                helperText={errors?.branchName?.message}
              />
            )}
          />

          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Code"
                fullWidth
                margin="normal"
                error={!!errors.code}
                helperText={errors?.code?.message}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.state}
                disabled={isSubmitting}
              >
                <InputLabel id="state-label">State</InputLabel>
                <Select {...field} labelId="state-label" label="State">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {states.map((st) => (
                    <MenuItem key={st} value={st}>
                      {st}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Typography variant="caption" color="error">
                    {errors.state.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.district}
                disabled={isSubmitting}
              >
                <InputLabel id="district-label">District</InputLabel>
                <Select {...field} labelId="district-label" label="District">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {districts.map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      {dist}
                    </MenuItem>
                  ))}
                </Select>
                {errors.district && (
                  <Typography variant="caption" color="error">
                    {errors.district.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Box mt={3} textAlign="right">
            <Button onClick={onClose} sx={{ mr: 2 }} color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {initialData ? "Submit" : "Save"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BranchFormModal;
