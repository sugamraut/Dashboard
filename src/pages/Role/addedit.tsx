
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputField from "../../components/Input_field";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { fetchAllPermissions } from "../../store/Permission/PermissionSlice";

interface AddEditProps {
  initialData?: any;
}

export interface FormDataState {
  code: string;
  Name: string;
}

const defaultFormData: FormDataState = {
  code: "",
  Name: "",
};

const ADDEDIT: React.FC<AddEditProps> = ({ initialData }) => {
  const dispatch = useAppDispatch();
  const fulllist = useAppSelector(
    (state: RootState) => state.permissions.fulllist ?? []
  );

  const [formData, setFormData] = useState<FormDataState>(defaultFormData);

  const [checkedPermissions, setCheckedPermissions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (fulllist.length > 0) {
      const initialState: { [key: string]: boolean } = {};
      fulllist.forEach((perm: any) => {
        const group = perm.group ?? "Ungrouped";
        const key = `${group}-${perm.code}`;
        initialState[key] = false;
      });
      setCheckedPermissions(initialState);
    }
  }, [fulllist]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        Name: initialData.Name || "",
      });

      if (initialData.permissions && Array.isArray(initialData.permissions)) {
        const editState: { [key: string]: boolean } = {};
        fulllist.forEach((perm: any) => {
          const group = perm.group ?? "Ungrouped";
          const key = `${group}-${perm.code}`;
          editState[key] = initialData.permissions.includes(perm.code);
        });
        setCheckedPermissions(editState);
      }
    }
  }, [initialData, fulllist]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const groupedPermissions = fulllist.reduce((acc, perm) => {
    const group = perm.group ?? "Ungrouped";
    acc[group] = acc[group] ?? [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, typeof fulllist>);

  const handleGroupToggle = (groupName: string, checked: boolean) => {
    const updated = { ...checkedPermissions };
    groupedPermissions[groupName].forEach((perm) => {
      const key = `${groupName}-${perm.code}`;
      updated[key] = checked;
    });
    setCheckedPermissions(updated);
  };

  const handlePermissionChange = (
    groupName: string,
    code: string,
    checked: boolean
  ) => {
    const key = `${groupName}-${code}`;
    setCheckedPermissions((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", borderRadius: 2, bgcolor: "Background.paper", p: 2 }}>
      <form>
        <InputField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <InputField
          label="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        {Object.entries(groupedPermissions).map(([groupName, permissions]) => {
          const keys = permissions.map((perm) => `${groupName}-${perm.code}`);
          const allChecked = keys.every((key) => checkedPermissions[key]);
          const someChecked = keys.some((key) => checkedPermissions[key]) && !allChecked;

          return (
            <Box key={groupName} sx={{ mb: 2 }}>
              {/* Group checkbox */}
              <FormControlLabel
                label={groupName}
                control={
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={(e) => handleGroupToggle(groupName, e.target.checked)}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 34 } }}
                  />
                }
                sx={{ "& .MuiTypography-root": { fontSize: 22, fontWeight: 550 } }}
              />

              {/* Children */}
              <Box sx={{ display: "flex", flexWrap: "wrap", ml: 4 }}>
                {permissions.map((perm) => {
                  const key = `${groupName}-${perm.code}`;
                  return (
                    <FormControlLabel
                      key={key}
                      label={perm.name}
                      control={
                        <Checkbox
                          checked={checkedPermissions[key] || false}
                          onChange={(e) =>
                            handlePermissionChange(groupName, perm.code, e.target.checked)
                          }
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                        />
                      }
                      sx={{ "& .MuiTypography-root": { fontSize: 20 }, minWidth: "150px" }}
                    />
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </form>
    </Box>
  );
};

export default ADDEDIT;

