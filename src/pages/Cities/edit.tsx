import React, { useEffect, useMemo, useState } from "react";
import { Box, Alert, Button, Autocomplete, TextField } from "@mui/material";
import InputField from "../../components/Input_field";
import { fetchStates } from "../../store/state/StateSlice";
import { createCity, updatecity } from "../../store/cities/CitiesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";

interface EditBranchFormProps {
  initialData?: Partial<FormDataState> & { id?: number };
  onClose?: () => void;
  onSubmit?: (data: FormDataState) => void;
}

export interface FormDataState {
  id: number;
  name: string;
  state: string;
  district: string;
  nameNp: string;
}

const defaultFormData: FormDataState = {
  name: "",
  state: "",
  district: "",
  nameNp: "",
  id: 0,
};

const AddEditPage: React.FC<EditBranchFormProps> = ({
  initialData = {},
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { fullList } = useAppSelector((state) => state.city);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    id: number;
    district: string;
  } | null>(null);

  const { statesList = [], loading } = useAppSelector(
    (state) => state.states || {}
  );

  const [formData, setFormData] = useState<FormDataState>({
    ...defaultFormData,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      // ...initialData,
      state: initialData?.state?.toString() || "",
      district: initialData?.district?.toString() || "",
      nameNp: initialData?.nameNp?.toString() || "",
    }));
  }, [initialData]);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSelectChange = (e: SelectChangeEvent<string>) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   if (!name) return;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.state || !formData.district) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      id: formData.id,
      name: formData.name,
      nameNp: formData.nameNp || "",
      nameCombined: `${formData.name}, ${formData.nameNp}`,
      code: null,
      stateId: parseInt(formData.state),
      districtId: parseInt(formData.district),
      state: formData.state,
      district: formData.district,
    };

    try {
      if (initialData?.id) {
        await dispatch(
          updatecity({
            ...payload,
            id: initialData.id!,
            nameNp: formData.nameNp,
            nameCombined: formData.nameNp,
            code: null,
            district: formData.district,
            state: formData.state,
          })
        ).unwrap();
      } else {
        await dispatch(createCity(payload)).unwrap();
      }
      if (onClose) onClose();
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
    }
  };

  const district = useMemo(() => {
    if (!fullList) return [];
    const uniqueMap = new Map<string, { id: number; district: string }>();
    for (const item of fullList) {
      const key = item.district.trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, { id: item.districtId, district: item.district });
      }
    }

    return Array.from(uniqueMap.values());
  }, [fullList]);

  // useEffect(() => {
  //   if (formData.district && district.length > 0) {
  //     const found = district.find((d) => d.id === Number(formData.district));
  //     if (found) {
  //       setSelectedDistrict(found);
  //     }
  //   }
  // }, [formData.district, district]);

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Autocomplete
          fullWidth
          sx={{ minWidth: 250 }}
          options={statesList}
          getOptionLabel={(option) => option.name || "n/a"}
          value={
            statesList.find(
              (state) => state.id.toString() === formData.state
            ) || null
          }
          loading={loading}
          onChange={(_, newValue) => {
            setFormData((prev) => ({
              ...prev,
              state: newValue ? newValue.id.toString() : "",
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              margin="normal"
              value={formData.state}
            />
          )}
        />
        <Autocomplete
          fullWidth
          sx={{ minWidth: 250 }}
          options={district}
          getOptionLabel={(option) => option.district || "n/a"}
          value={selectedDistrict}
          onChange={(_, newValue) => {
            setSelectedDistrict(newValue);
            setFormData((prev) => ({
              ...prev,
              district: newValue ? newValue.id.toString() : "",
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="District Name"
              margin="normal"
              value={formData.district}
            />
          )}
        />

        <InputField
          label="City Name (English)"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <InputField
          label="city Name (Nepali)"
          name="city name in nepali"
          value={formData.nameNp}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <Box mt={2}>
          <Button onClick={onClose} color="error" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEditPage;
