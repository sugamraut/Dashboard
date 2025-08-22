import React, { useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import InputField from "../../components/Input_field";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { fetchAllPermissions } from "../../store/Permission/PermissionSlice";

interface AddEditProps {
  initialData?: {
    Name?: string;
    Permissions?: [];
  } | null;
}

const ADDEDIT: React.FC<AddEditProps> = ({ initialData }) => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(
    (state: RootState) => state.permissions.fulllist ?? []
  );

  const [formData, setFormData] = useState({
    Name: "",
  });

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      Name: initialData.Name ?? "",
    });

    const checkedMap: Record<string, boolean> = {};

    initialData.Permissions?.forEach((code) => {
      const permission = permissions.find((p) => p.code === code);
      const group = permission?.group;
      checkedMap[`${group}-${code}`] = true;
    });

    setChecked(checkedMap);
  }, [initialData, permissions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (group: string, code: string, value: boolean) => {
    setChecked((prev) => ({
      ...prev,
      [`${group}-${code}`]: value,
    }));
  };

  const handleGroupCheck = (
    group: string,
    // checked: boolean,
    checkedValue: boolean,
    codes: string[]
  ) => {
    const updated = { ...checked };
    codes.forEach((code) => {
      updated[`${group}-${code}`] = checkedValue;
    });

    setChecked(updated);
  };

  const grouped = permissions.reduce((acc, perm) => {
    const group = perm.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <form>
        {/* <InputField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        /> */}

        <InputField
          label="Name"
          name="Name"
          value={formData.Name}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />

        {Object.entries(grouped).map(([group, perms]) => {
          const name = perms.map((p) => p.name);
          const allChecked = name.every((code) => checked[`${group}-${code}`]);
          const someChecked =
            name.some((code) => checked[`${group}-${code}`]) && !allChecked;

          return (
            <Box key={group} mb={2}>
              <FormControlLabel
                //parent
                control={
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={(e) =>
                      handleGroupCheck(group, e.target.checked, name)
                    }
                  />
                }
                label={
                  <Typography fontSize={18} fontWeight={600}>
                    {group}
                  </Typography>
                }
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", ml: 4 }}>
                {perms.map((perm) => {
                  const key = `${group}-${perm.name}`;

                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={!!checked[key]}
                          onChange={(e) =>
                            handleCheck(group, perm.name, e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography fontSize={16} fontWeight={450}>
                          {perm.name}
                        </Typography>
                      }
                      sx={{ minWidth: 150 }}
                    />
                  );
                })}
              </Box>
              <hr />
            </Box>
          );
        })}
      </form>
    </Box>
  );
};

export default ADDEDIT;
