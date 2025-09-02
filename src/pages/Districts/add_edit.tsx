import React, { useEffect, useMemo } from "react";
import {
  Box,
  Alert,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  fetchDistrictAsync,
  updateDistrictAsync,
} from "../../store/districts/DistrictsSlice";
import InputField from "../../components/Input_field";

import type { DistrictType } from "../../globals/typeDeclaration";
import { toast } from "react-toastify";
import {
  districtSchema,
  type DistrictFormData,
} from "../../globals/ZodValidation";

interface EditDistrictFormProps {
  initialData?: Partial<DistrictType> & {
    nameCombined?: string;
  };
  onClose?: () => void;
}

const EditDistrictForm: React.FC<EditDistrictFormProps> = ({
  initialData = {},
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { fullList: districts, error: apiError } = useAppSelector(
    (state) => state.district
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DistrictFormData>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      name: initialData?.name || "",
      nameNp: initialData?.nameNp || "",
      state: initialData?.state?.id ? String(initialData.state.id) : "",
    },
  });

  useEffect(() => {
    if (!districts || districts.length === 0) {
      dispatch(fetchDistrictAsync());
    }
  }, [dispatch, districts]);

  const uniqueStates = useMemo(() => {
    const ids = new Set<number>();
    return (districts || [])
      .map((d) => d.state)
      .filter((state) => {
        if (!state || ids.has(state.id)) return false;
        ids.add(state.id);
        return true;
      });
  }, [districts]);

  const onSubmit = async (data: DistrictFormData) => {
    if (!initialData?.id) return;

    try {
      await dispatch(
        updateDistrictAsync({
          id: initialData.id,
          data: {
            name: data.name,
            nameNp: data.nameNp,
            stateId: parseInt(data.state),
          },
        })
      );
      toast.success("District upadated successfully....");

      onClose?.();
    } catch (err) {
      toast.error(err?.toString() || "District update failed");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {" "}
        {initialData.id ? "Edit District " : "Add District"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-3">
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={uniqueStates}
              getOptionLabel={(option) =>
                option?.nameCombined || option?.nameNp || ""
              }
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              value={
                uniqueStates.find((s) => s.id.toString() === field.value) ||
                null
              }
              onChange={(_, newValue) => {
                field.onChange(newValue ? String(newValue.id) : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  margin="normal"
                  required
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="District Name"
              required
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="nameNp"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              value={field.value ?? ""}
              label="Name Combined"
              fullWidth
              margin="normal"
              error={!!errors.nameNp}
              helperText={errors.nameNp?.message}
            />
          )}
        />

        <Box mt={3} textAlign="right">
          <Button
            color="error"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default EditDistrictForm;
