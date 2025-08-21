import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hook";
import { createSetting, updateSetting } from "../../store/setting/settingSlice";
import type { Setting } from "../../globals/typeDeclaration";

interface AddEditProps {
  initialData?: Setting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ADDEDIT = ({ initialData, onSuccess, onCancel }: AddEditProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    value: string;
  }>({
    name: "",
    description: "",
    value: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        value: initialData.value || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: String(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await dispatch(
          updateSetting({
            id: initialData.id,
            updatedData: formData,
          }) as any
        ).unwrap();
      } else {
        await dispatch(createSetting(formData as Setting) as any).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving setting:", err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Name"
        name="name"
        onChange={handleInputChange}
        value={formData.name}
        margin="normal"
        fullWidth
        required
      />

      <TextField
        label="Description"
        name="description"
        onChange={handleInputChange}
        value={formData.description}
        margin="normal"
        fullWidth
        required
      />

      <TextField
        label="Value"
        name="value"
        placeholder="Enter the value"
        multiline
        minRows={4}
        onChange={handleInputChange}
        value={formData.value}
        margin="normal"
        fullWidth
        required
      />

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" color="error" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" color="primary">
          {initialData ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default ADDEDIT;
