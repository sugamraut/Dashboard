import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface EditBranchFormProps {
  initialData?: Partial<FormDataState>;
  onClose?: () => void;
}

interface FormDataState {
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
}) => {
  const [formData, setFormData] = useState<FormDataState>(defaultFormData);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.branchName || !formData.code) {
      setError("Branch Name and Code are required.");
      return;
    }

    setError(null);
    alert("Form submitted with: " + JSON.stringify(formData, null, 2));
    if (onClose) onClose();
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
      <Box
        mb={2}
        // sx={{
        //   position: 'sticky',
        //   top: 10,
        //   backgroundColor: 'white',
        //   zIndex:1,
        //   height:'60px'

        // }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Edit Branches
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          label="Branch Name"
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          required
          fullWidth
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          required
          fullWidth
          label="Telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Fax"
          name="fax"
          value={formData.fax}
          onChange={handleChange}
        />

        <Typography variant="subtitle1" fontWeight="bold">
          Address
        </Typography>

        <FormControl fullWidth required margin="normal">
          <InputLabel>State</InputLabel>
          <Select
            name="state"
            value={formData.state}
            onChange={handleChange}
            label="State"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="State 1">State 1</MenuItem>
            <MenuItem value="State 2">State 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth disabled required margin="normal">
          <InputLabel>District</InputLabel>
          <Select
            name="district"
            value={formData.district}
            onChange={handleChange}
            label="District"
          >
            <MenuItem value="Good District">Good District</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Street Address"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Ward No."
          name="wardNo"
          value={formData.wardNo}
          onChange={handleChange}
          margin="normal"
        />
      </form>
    </Box>
  );
};

export default EditBranchForm;
