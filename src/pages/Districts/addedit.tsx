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
  nameNp: string;
  name: string;
  state: string;
  district: string;
}

const defaultFormData: FormDataState = {
  name: "",
  nameNp: "",
  state: "",
  district: "",
};

const EditDistrictForm: React.FC<EditDistrictFormProps> = ({
  initialData = {},
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { fullList: districts, error } = useAppSelector(
    (state) => state.district 
  );

  const [formData, setFormData] = useState<FormDataState>({
    ...defaultFormData,
    name: initialData.name || "",
    nameNp: initialData.nameNp || "",
    state: initialData.state?.id ? String(initialData.state.id) : "",
    district: initialData.id ? String(initialData.id) : "",
  });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!districts || districts.length === 0) {
      dispatch(fetchDistrictAsync());
    }
  }, [dispatch, districts]);

  const uniqueStates = useMemo(() => {
    const ids = new Set<number>();
    return (districts || [])
      .map((d: { state: any; }) => d.state)
      .filter((state: { id: number; }) => {
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
      setLocalError("Name and State are required.");
      return;
    }

    try {
      if (initialData?.id) {
        await dispatch(
          updateDistrictAsync({
            id: initialData.id,
            data: {
              name: formData.name,
              nameNp: formData.nameNp,
            },
          })
        ); 

        onClose?.();
      } else {
        setLocalError("Missing district ID.");
      }
    } catch (err) {
      setLocalError("Failed to update district.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {localError && <Alert severity="error">{localError}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Autocomplete
        fullWidth
        options={uniqueStates}
        getOptionLabel={(option) => option?.name || option?.nameNp || ""}
        value={uniqueStates.find((s: { id: any; }) => String(s.id) === formData.state) || null}
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
        value={formData.nameNp}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Box mt={3} textAlign="right" gap={2}>
        <Button  color="error" onClick={onClose} sx={{ mr: 2 }} >
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditDistrictForm;
