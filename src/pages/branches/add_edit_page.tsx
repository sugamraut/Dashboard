import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { TextField } from "@mui/material"; 


interface EditBranchFormProps {
  initialData?: Partial<FormDataState>;
  onClose?: () => void;
  onSubmit?: (data: FormDataState) => void;
}

export interface FormDataState {
  branchName: string;
  code: string;
  telephone: string;
  email: string;
  fax: string;
  state: string;
  district: string;
  city: string;
  streetAddress: string;
  wardNo: string;
}

const defaultFormData: FormDataState = {
  branchName: "",
  code: "",
  telephone: "",
  email: "",
  fax: "",
  state: "",
  district: "",
  city: "",
  streetAddress: "",
  wardNo: "",
};

const EditBranchForm: React.FC<EditBranchFormProps> = ({
  initialData = {},
  onClose,
  onSubmit,
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
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
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

    if (!formData.branchName || !formData.code) {
      setError("Branch Name and Code are required.");
      return;
    }

    setError(null);
    onSubmit?.(formData);
    onClose?.();
  };

  return (
    <Box  sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 3,
        borderRadius: 2,
      }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Branch Name"
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
           fullWidth
          margin="normal"
        />
        <TextField
          label="Telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
           fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
           fullWidth
          margin="normal"
        />
        <TextField
          label="Fax"
          name="fax"
          value={formData.fax}
          onChange={handleChange}
           fullWidth
          margin="normal"
        />

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

        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
           fullWidth
          margin="normal"
        />
        <TextField
          label="Street Address"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
           fullWidth
          margin="normal"
        />
        <TextField
          label="Ward No."
          name="wardNo"
          value={formData.wardNo}
          onChange={handleChange}
           fullWidth
          margin="normal"
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth id="branch-form-submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditBranchForm;




