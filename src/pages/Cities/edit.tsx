import React, { useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "../../components/Input_field";
import { fetchStates } from "../../store/state/StateSlice";
import { createCity, updatecity } from "../../store/cities/CitiesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { citySchema, type CityFormData } from "../../globals/ZodValidation";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";

interface EditBranchFormProps {
  initialData?: Partial<CityFormData> & { id?: number };
  onClose?: () => void;
}

const AddEditCity: React.FC<EditBranchFormProps> = ({
  initialData,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const { fullList } = useAppSelector((state: RootState) => state.city);
  const { statesList = [] } = useAppSelector(
    (state: RootState) => state.states || {}
  );

  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: initialData?.name || "",
      nameNp: initialData?.nameNp || "",
      state: initialData?.state?.toString() || "",
      district: initialData?.district?.toString() || "",
    },
  });

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

 
  const districts = useMemo(() => {
    const map = new Map<string, { id: number; district: string }>();
    for (const item of fullList || []) {
      const districtName =
        typeof item.district === "string"
          ? item.district.trim().toLowerCase()
          : "";

      if (!districtName) continue;

      if (!map.has(districtName)) {
        map.set(districtName, {
          id: item.districtId,
          district:
            typeof item.district === "string"
              ? item.district
              : String(item.district),
        });
      }
    }

    return Array.from(map.values());
  }, [fullList]);

  const onSubmit = async (data: CityFormData) => {
    const payload = {
      id: initialData?.id !,
      name: data.name,
      nameNp: data.nameNp,
      nameCombined: `${data.name}, ${data.nameNp}`,
      code: null,
      stateId: parseInt(data.state),
      districtId: parseInt(data.district),
      state: data.state,
      district: data.district,
    };

    try {
      if (initialData?.id) {
        await dispatch(updatecity({ ...payload })).unwrap();
        toast.success("City updated successfully");
      } else {
        await dispatch(createCity(payload)).unwrap();
        toast.success("City created successfully");
      }

      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData?.id ? "Edit City" : "Add City"}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={statesList}
                getOptionLabel={(option) => option.name || "N/A"}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                value={
                  statesList.find((s) => s.id.toString() === field.value) ||
                  null
                }
                onChange={(_, newValue) =>
                  field.onChange(newValue ? newValue.id.toString() : "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    margin="normal"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={districts}
                getOptionLabel={(option) => option.district || "N/A"}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                value={
                  districts.find((d) => d.id.toString() === field.value) || null
                }
                onChange={(_, newValue) =>
                  field.onChange(newValue ? String(newValue.id) : "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District"
                    margin="normal"
                    error={!!errors.district}
                    helperText={errors?.district?.message}
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
                label="City Name (English)"
                margin="normal"
                required
                error={!!errors.name}
                helperText={errors?.name?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="nameNp"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="City Name (Nepali)"
                margin="normal"
                required
                error={!!errors.nameNp}
                helperText={errors?.nameNp?.message}
                fullWidth
              />
            )}
          />

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} color="error" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {initialData?.id ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCity;
