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
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";

// Optional: Define types for props
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

const EditBranchForm: React.FC<EditBranchFormProps> = ({ initialData = {}, onClose }) => {
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

    // Add validation if needed
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
        maxWidth: 600,
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "white",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Edit Branches
        </Typography>
        <Link to="/admin">
          <Button size="small" color="error" startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Link>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        
          {/* Top Fields */}
          <Grid item xs={12} sm={6} mt={2}>
            <TextField
              required
              fullWidth
              label="Branch Name"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}  mt={2}>
            <TextField
              required
              fullWidth
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}  mt={2}>
            <TextField
              required
              fullWidth
              label="Telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}  mt={2}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}  mt={2}>
            <TextField
              fullWidth
              label="Fax"
              name="fax"
              value={formData.fax}
              onChange={handleChange}
            />
          </Grid>

          {/* Address Label */}
          <Grid item xs={12}  mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Address
            </Typography>
          </Grid>

          {/* State & District */}
          <Grid item xs={12} sm={6}  mt={2}>
            <FormControl fullWidth required>
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
          </Grid>

          <Grid item xs={12} sm={6}  mt={2}>
            <FormControl fullWidth disabled required>
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
          </Grid>

          {/* More Address Fields */}
          <Grid item xs={12} sm={6}  mt={2}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}  mt={2}>
            <TextField
              fullWidth
              label="Street Address"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}  mt={2}>
            <TextField
              fullWidth
              label="Ward No."
              name="wardNo"
              value={formData.wardNo}
              onChange={handleChange}
            />
          </Grid>
      

        {/* Submit Button */}
        <Box mt={3} textAlign="right"  mt={2}>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditBranchForm;
