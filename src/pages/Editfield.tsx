import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";

export default function EditBranchForm({ initialData = {}, onClose }: any) {
  const [formData, setFormData] = useState({
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
  });

  const [error, setError] = useState<string | null>("");
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        branchName: initialData.name || "",
        code: initialData.code || "",
        
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Edit Branches
        </Typography>
        <Link to={{ pathname: "/admin/branch" }}>
          <Button size="small" color="error" startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Link>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* <Grid container spacing={2}> */}
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
        <Grid item xs={12} sm={6} mt={2}>
          <TextField
            required
            fullWidth
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} mt={2}>
          <TextField
            required
            fullWidth
            label="Telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} mt={2}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} mt={2}>
          <TextField
            fullWidth
            label="Fax"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} mt={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Address
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} mt={2}>
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
        <Grid item xs={12} sm={6} mt={2}>
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

        <Grid item xs={12} sm={6} mt={2}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} mt={2}>
          <TextField
            fullWidth
            label="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} mt={2}>
          <TextField
            fullWidth
            label="Ward No."
            name="wardNo"
            value={formData.wardNo}
            onChange={handleChange}
          />
        </Grid>
        {/* </Grid> */}

        <Box mt={3} textAlign="right">
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
