import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import type { SelectChangeEvent } from "@mui/material";
import InputField from "../../components/Input_field";
import type { StateType } from "../../globals/typeDeclaration";

export interface FormDataState {
  nameCombined: string;
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
  nameCombined: "",
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

      <Autocomplete
        fullWidth
        options={
          districts
            ? Array.from(
                new Map(districts.map((d) => [d.state.id, d.state])).values()
              )
            : []
        }
        getOptionLabel={(option: StateType) =>
          option.nameNp || option.name || ""
        }
        value={
          districts
            ?.map((d) => d.state)
            .find((s) => String(s.id) === formData.state) || null
        }
        onChange={(_: React.SyntheticEvent, newValue: StateType | null) => {
          setFormData((prev) => ({
            ...prev,
            state: newValue ? String(newValue.id) : "",
          }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="State" margin="normal" />
        )}
      />

      <Autocomplete
        fullWidth
        options={districts ?? []}
        getOptionLabel={(option: any) =>
          option.nameNp ? `${option.nameNp} (${option.name})` : option.name
        }
        value={
          districts?.find((d) => String(d.id) === formData.district) || null
        }
        onChange={(_, newValue) => {
          setFormData((prev) => ({
            ...prev,
            district: newValue ? String(newValue.id) : "",
          }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="District" margin="normal" />
        )}
      />

      <InputField
        label="Name"
        name="Name"
        value={formData.name}
        onChange={handleChange}
        required
        margin="normal"
        fullWidth
        className="fs-1"
      />

      <InputField
        label="Name "
        name="Name"
        value={formData.nameCombined}
        onChange={handleChange}
        required
        margin="normal"
        fullWidth
      />
    </Box>
  );
};

export default AddEditPage;
