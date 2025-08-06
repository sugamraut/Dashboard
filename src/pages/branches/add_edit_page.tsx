import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  type SelectChangeEvent,
} from "@mui/material";

interface FormDataState {
  branchName: string;
  code: string;
  state: string;
  district: string;
}

const defaultFormData: FormDataState = {
  branchName: "",
  code: "",
  state: "",
  district: "",
};

interface BranchFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: FormDataState | null;
  onSubmit: (data: FormDataState) => Promise<void>;
  states: string[];
  districts: string[];
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({
  open,
  onClose,
  initialData = null,
  onSubmit,
  states,
  districts,
}) => {
  const [formData, setFormData] = useState<FormDataState>(defaultFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
    setFormError(null);
  }, [initialData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.branchName || !formData.code) {
      setFormError("Branch Name and Code are required.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setFormError(err.message || "Failed to save branch.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          margin: "auto",
          mt: 5,
          p: 4,
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          {initialData ? "Edit Branch" : "Add Branch"}
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Branch Name"
            name="branchName"
            value={formData.branchName}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            disabled={submitting}
          />
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            disabled={submitting}
          />

          <FormControl fullWidth margin="normal" disabled={submitting}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              name="state"
              value={formData.state}
              onChange={handleSelectChange}
              label="State"
              required
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {states.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={submitting}>
            <InputLabel id="district-label">District</InputLabel>
            <Select
              labelId="district-label"
              name="district"
              value={formData.district}
              onChange={handleSelectChange}
              label="District"
              required
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {districts.map((dist) => (
                <MenuItem key={dist} value={dist}>
                  {dist}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={3} textAlign="right">
            <Button onClick={onClose} sx={{ mr: 2 }} >
              Cancel
            </Button>
            <Button variant="contained" type="submit" >
              {initialData ? "Submit" : "Save"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BranchFormModal;
