import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Alert,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  fetchDistrictAsync,
  updateDistrictAsync,
} from "../../store/districts/DistrictsSlice";
import InputField from "../../components/Input_field";

import type { DistrictType, StateType } from "../../globals/typeDeclaration";

interface EditDistrictFormProps {
  initialData?: Partial<DistrictType> & {
    nameCombined?: string;
  };
  onClose?: () => void;
}

interface FormDataState {
  nameCombined: string;
  name: string;
  state: string; 
  district: string; 
}

const defaultFormData: FormDataState = {
  name: "",
  nameCombined: "",
  state: "",
  district: "",
};

const EditDistrictForm: React.FC<EditDistrictFormProps> = ({
  initialData = {},
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { data: districts, status, error } = useAppSelector(
    (state) => state.distric
  );

  const [formData, setFormData] = useState<FormDataState>({
    ...defaultFormData,
    name: initialData.name || "",
    nameCombined: initialData.nameCombined || "",
    state: initialData.state?.id ? String(initialData.state.id) : "",
    district: initialData.id ? String(initialData.id) : "",
  });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!districts) {
      dispatch(fetchDistrictAsync());
    }
  }, [dispatch, districts]);

  const uniqueStates = useMemo(() => {
  const ids = new Set<number>();
  return (districts || [])
    .map((d) => d.state)
    .filter((state): state is StateType => {
      if (!state || ids.has(state.id)) return false;
      ids.add(state.id);
      return true;
    });
}, [districts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.state) {
      setLocalError("Name and state are required.");
      return;
    }

    setLocalError(null);

    try {
      if (initialData?.id) {
        await dispatch(
          updateDistrictAsync(initialData.id, {
            name: formData.name,
            nameCombined: formData.nameCombined,
            state: Number(formData.state),
            district: Number(formData.district),
          })
        );

        onClose?.();
      } else {
        setLocalError("No district ID provided for update.");
      }
    } catch (err) {
      setLocalError("Failed to update district.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Edit District
      </Typography>

      {localError && <Alert severity="error">{localError}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Autocomplete
        fullWidth
        options={uniqueStates}
        getOptionLabel={(option) => option?.nameNp || option?.name || ""}
        value={
          uniqueStates.find((s) => String(s.id) === formData.state) || null
        }
        onChange={(_, newValue) =>
          setFormData((prev) => ({
            ...prev,
            state: newValue ? String(newValue.id) : "",
          }))
        }
        renderInput={(params) => (
          <TextField {...params} label="State" margin="normal" required />
        )}
      />

      <Autocomplete
        fullWidth
        options={districts || []}
        getOptionLabel={(option) =>
          option?.nameNp
            ? `${option.nameNp} (${option.name})`
            : option?.name || ""
        }
        value={
          districts?.find((d) => String(d.id) === formData.district) || null
        }
        onChange={(_, newValue) =>
          setFormData((prev) => ({
            ...prev,
            district: newValue ? String(newValue.id) : "",
          }))
        }
        renderInput={(params) => (
          <TextField {...params} label="District" margin="normal" />
        )}
      />

      <InputField
        label="District Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <InputField
        label="Name Combined"
        name="nameCombined"
        value={formData.nameCombined}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditDistrictForm;
