import React, { useEffect, useMemo } from "react";
import { Box, Alert, TextField, Autocomplete, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  fetchDistrictAsync,
  updateDistrictAsync,
} from "../../store/districts/DistrictsSlice";
import InputField from "../../components/Input_field";

import type { DistrictType } from "../../globals/typeDeclaration";

interface EditDistrictFormProps {
  initialData?: Partial<DistrictType> & {
    nameCombined?: string;
  };
  onClose?: () => void;
}


const schema = z.object({
  name: z.string().min(1, "District name is required"),
  nameNp: z.string().optional(),
  state: z.string().min(1, "State is required"),
});

type FormValues = z.infer<typeof schema>;

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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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


  const onSubmit = async (data: FormValues) => {
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

      onClose?.();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              uniqueStates.find((s) => s.id.toString() === field.value) || null
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
    </Box>
  );
};

export default EditDistrictForm;
