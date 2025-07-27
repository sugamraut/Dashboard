import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Typography, TextField, Stack, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchAllDistrictsAsync, fetchDistrictAsync } from "../../store/districts/DistrictsSlice";
import AddEditPage from "./add_edit_page";
import type { DistrictType } from "../../globals/typeDeclaration";

export default function DistrictPage() {
  const dispatch = useDispatch<AppDispatch>();

  const fullDistrictList = useSelector((state: RootState) => state.distric.fullList ?? []);
  const districtList = useSelector((state: RootState) => Array.isArray(state.distric.list) ? state.distric.list : []);
  const totalCount = useSelector((state: RootState) => state.distric.totalCount ?? 0);

  // UI state
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<null | { id: number; name: string; nameNp?: string }>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDistrictItem, setSelectedDistrictItem] = useState<DistrictType | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchAllDistrictsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDistrictAsync(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage, selectedState, search]);

  const states = useMemo(() => {
    const ids = new Set<number>();
    return fullDistrictList
      .map((d) => d.state)
      .filter((s) => s && !ids.has(s.id) && ids.add(s.id));
  }, [fullDistrictList]);

  const handleEditClick = (district: DistrictType) => {
    setSelectedDistrictItem(district);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedDistrictItem(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormSubmit = () => {
    handleDialogClose();
  };

  const handleClearFilters = () => {
    setSelectedState(null);
    setSearch("");
    setPage(0);
  };

  const handleStateFilterChange = (_: any, newValue: any) => {
    setSelectedState(newValue);
    setPage(0);
  };

  return (
    <Box marginLeft={10} padding={2}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" fontWeight="bold" paddingBottom={2}>
          Districts
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            size="small"
            sx={{ minWidth: 250 }}
            options={states}
            getOptionLabel={(option) => option.name || option.nameNp || ""}
            value={selectedState}
            onChange={handleStateFilterChange}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => <TextField {...params} label="Filter by State" />}
            clearOnEscape
          />

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search district name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <IconButton color="error" onClick={handleClearFilters} title="Clear Filters">
            <FilterAltOffIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>District</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {districtList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No districts found</TableCell>
              </TableRow>
            ) : (
              districtList.map((district,index) => (
                <TableRow key={district.id}>
                  <TableCell>{district.id}</TableCell>
                  
                  <TableCell>{district.name}</TableCell>
                  <TableCell>{district.state?.name || "N/A"}</TableCell>
                  <TableCell>{district.nameCombined || district.name}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEditClick(district)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => alert(`Delete district ${district.name} (id: ${district.id})`)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDistrictItem ? "Edit District" : "Add District"}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            {selectedDistrictItem ? "Edit the details below" : "Please fill in the details below"}
          </Typography>
          <AddEditPage initialData={selectedDistrictItem ?? undefined} onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit}>
            Submit
          </Button>
          <Button onClick={handleDialogClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
