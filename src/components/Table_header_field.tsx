import React from "react";
import {
  Box,
  TextField,
  IconButton,
  type SelectChangeEvent,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddIcon from "@mui/icons-material/Add";
import DropdownField from "./Dropbox_field";

type BranchFilterBarProps = {
  state: string;
  district: string;
  onStateChange?: (event: SelectChangeEvent) => void;
  onDistrictChange?: (event: SelectChangeEvent) => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters?: () => void;
  onAdd?: () => void;
};

const BranchFilterBar: React.FC<BranchFilterBarProps> = ({
  onSearchChange,
  onClearFilters,
  onAdd,
}) => {
  const stateOptions = ["State 1", "State 2", "State 3"];
  const districtOptions = ["Kathmandu", "Lalitpur", "Bhaktapur"];
  const handleChange=()=>{
    console.log("subbmit")
  }

  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <DropdownField
        label="District"
        name="district"
        value={FormData.district}
        onChange={handleChange}
        options={districtOptions}
        required
      />

      <DropdownField
        label="State"
        name="state"
        value={FormData.state}
        onChange={handleChange}
        options={stateOptions}
        required
      />

      <TextField size="small" label="Search" onChange={onSearchChange} />

      <IconButton color="error" onClick={onClearFilters}>
        <FilterAltOffIcon />
      </IconButton>

      <IconButton color="primary" onClick={onAdd}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default BranchFilterBar;
