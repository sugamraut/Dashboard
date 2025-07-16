import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  type SelectChangeEvent,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddIcon from "@mui/icons-material/Add";

type BranchFilterBarProps = {
  state: string;
  district: string;
 onStateChange: (event: SelectChangeEvent) => void; 
  onDistrictChange: (event: SelectChangeEvent) => void; 
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
  onAdd: () => void;
};

const BranchFilterBar: React.FC<BranchFilterBarProps> = ({
  state,
  district,
  onStateChange,
  onDistrictChange,
  onSearchChange,
  onClearFilters,
  onAdd,
}) => {
  return (
    <Box display="flex" gap={2}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>By State</InputLabel>
        <Select label="By State" value={state} onChange={onStateChange}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="State 1">State 1</MenuItem>
          <MenuItem value="State 2">State 2</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>District</InputLabel>
        <Select label="District" value={district} onChange={onDistrictChange}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Good District">Good District</MenuItem>
        </Select>
      </FormControl>

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
