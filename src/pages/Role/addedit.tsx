import React, { useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import InputField from "../../components/Input_field";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { fetchAllPermissions } from "../../store/Permission/PermissionSlice";

interface AddEditProps {
  initialData?: {
    code?: string;
    Name?: string;
    permissions?: string[];
  };
}

const ADDEDIT: React.FC<AddEditProps> = ({ initialData }) => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(
    (state: RootState) => state.permissions.fulllist ?? []
  );

  const [formData, setFormData] = useState({
    code: "",
    Name: "",
  });

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

 useEffect(() => {
  if (!initialData) return;


  setFormData({
    code: initialData.code ?? "",
    Name: initialData.Name ?? "",
  });


  const checkedMap: Record<string, boolean> = {};

  initialData.permissions?.forEach((code) => {
    const permission = permissions.find((p) => p.code === code);
    const group = permission?.group || "Ungrouped";
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
    checked: boolean,
    codes: string[]
  ) => {
    const updated = { ...checked };
    codes.forEach((code) => {
      updated[`${group}-${code}`] = checked;
    });
    setChecked(updated);
  };

  const grouped = permissions.reduce(
    (acc, perm) => {
      const group = perm.group || "Ungrouped";
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    },
    {} as Record<string, typeof permissions>
  );
  // console.log("====>", grouped);

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
        <InputField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          required
          fullWidth
          margin="normal"
        />

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
          const codes = perms.map((p) => p.code);
          const allChecked = codes.every((code) => checked[`${group}-${code}`]);
          const someChecked =
            codes.some((code) => checked[`${group}-${code}`]) && !allChecked;

          return (
            <Box key={group} mb={2}>
              <FormControlLabel
                //parent
                control={
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={(e) =>
                      handleGroupCheck(group, e.target.checked, codes)
                    }
                  />
                }
                label={<Typography fontWeight={600}>{group}</Typography>}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", ml: 4 }}>
                {perms.map((perm, index) => {
                  // const key = `${group}-${perm.code}`;
                  // const safeCode = `${perm.code} || missing-${index}`;
                  // const key = `${group}-${safeCode}`;
                  const key = `test-${perm.code ?? `missing-${index}`}`;

                  return (
                    <FormControlLabel
                      //childern
                      key={key}
                      control={
                        <Checkbox
                          checked={!!checked[key]}
                          onChange={(e) =>
                            handleCheck(group, perm.code, e.target.checked)
                          }
                        />
                      }
                      label={perm.name}
                      sx={{ minWidth: 150 }}
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
