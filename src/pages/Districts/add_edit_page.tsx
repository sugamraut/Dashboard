import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,

  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import type { SelectChangeEvent } from "@mui/material";
import InputField from "../../components/Input_field";


export interface FormDataState {
  Name: string;
  name: string;
  state: string;
  district: string;
}
interface EditBranchFormProps {
  initialData?: Partial<FormDataState>;
  onClose?: () => void;
  onSubmit?: (data: FormDataState) => void;
}

const defaultFormData: FormDataState = {
  Name: "",
  state: "",
  district: "",
  name: "",
};

const AddEditPage: React.FC<EditBranchFormProps> = ({
  initialData = {},
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormDataState>({
    ...defaultFormData,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);

  const districts = useSelector((state: RootState) => state.distric.data);

  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (!name) return;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name || !formData.name) {
      setError("Branch Name and Code are required.");
      return;
    }
    setError(null);
    onSubmit?.(formData);
    onClose?.();
  };

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>State</InputLabel>
          <Select
            name="state"
            value={formData.state}
            onChange={handleSelectChange}
            label="State"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {districts &&
              [
                ...new Map(
                  districts.map((d) => [d.state.id, d.state])
                ).values(),
              ].map((state) => (
                <MenuItem key={state.id} value={String(state.id)}>
                  {state.nameNp || state.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>District</InputLabel>
          <Select
            name="district"
            value={formData.district}
            onChange={handleSelectChange}
            label="District"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.isArray(districts) &&
              districts.map((d) => (
                <MenuItem key={d.id} value={String(d.id)}>
                  {d.nameNp ? `${d.nameNp} (${d.name})` : d.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <InputField
          label="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          required
          fullWidth
        />

        <InputField
          label="Code"
          name="code"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
      </form>
    </Box>
  );
};

export default AddEditPage;
