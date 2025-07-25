import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import InputField from "../../components/Input_field";

interface EditBranchFormProps {
  initialData?: Partial<FormDataState>;
  onClose?: () => void;
  onSubmit?: (data: FormDataState) => void;
}

export interface FormDataState {
  Name: string;
  name: string;
  state: string;
  district: string;
}

const defaultFormData: FormDataState = {
  Name: "",
  name: "",
  state: "",
  district: "",
};

const AddEditpage: React.FC<EditBranchFormProps> = ({
  initialData = {},
}) => {
  const [formData, setFormData] = useState<FormDataState>({
    ...defaultFormData,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 3,
        borderRadius: 2,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            name="state"
            value={formData.state}
            onChange={handleSelectChange}
            label="State"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="State 1">State 1</MenuItem>
            <MenuItem value="State 2">State 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="district-label">District</InputLabel>
          <Select
            labelId="district-label"
            name="district"
            value={formData.district}
            onChange={handleSelectChange}
            label="District"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="District 1">District 1</MenuItem>
            <MenuItem value="District 2">District 2</MenuItem>
          </Select>
        </FormControl>
        <InputField
          label="Name"
          name="branchName"
          value={formData.Name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <InputField
          label="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
      </form>
    </Box>
  );
};

export default AddEditpage;
