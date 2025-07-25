import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  TextField,
  Stack,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchDistrictAsync } from "../../store/districts/DistrictsSlice";
import AddEditPage from "./add_edit_page";

export default function DistrictPage() {
  const dispatch: AppDispatch = useDispatch();

  const districtList = useSelector((state: RootState) => state.distric.data ?? []);
  const totalCount = useSelector((state: RootState) => state.distric.totalCount ?? 0);

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<null | { id: number; name: string; nameNp?: string }>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDistrictItem, setSelectedDistrictItem] = useState<any | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // const states = React.useMemo(() => {
  //   const map = new Map<number, any>();
  //   districtList.forEach((d) => {
  //     if (d.state && !map.has(d.state.id)) {
  //       map.set(d.state.id, d.state);
  //     }
  //   });
  //   return Array.from(map.values());
  // }, [districtList]);
const states = React.useMemo(() => {
  const ids = new Set<number>();
  return districtList
    .map(d => d.state)
    .filter(state => state && !ids.has(state.id) && ids.add(state.id));
}, [districtList]);

  useEffect(() => {
    dispatch(fetchDistrictAsync(page + 1, rowsPerPage, selectedState ? String(selectedState.id) : ""));
  }, [dispatch, page, rowsPerPage, selectedState]);


  const filteredDistricts = districtList.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (district: any) => {
    setSelectedDistrictItem(district);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedDistrictItem(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

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

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="table-header" sx={{ marginBottom: 2 }}>
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
            onChange={(_, newValue) => {
              setSelectedState(newValue);
              setPage(0);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Filter by State" />}
            clearOnEscape
          />

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search current page"
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
            {filteredDistricts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No districts found
                </TableCell>
              </TableRow>
            )}

            {filteredDistricts.map((district, index) => (
              <TableRow key={district.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{district.name}</TableCell>
                <TableCell>{district.state?.name || "N/A"}</TableCell>
                <TableCell>{district.nameCombined || district.name}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(district)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      alert(`Delete district ${district.name} (id: ${district.id})`)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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

      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDistrictItem ? "Edit District" : "Add District"}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            {selectedDistrictItem
              ? "Edit the details below"
              : "Please fill in the details below"}
          </Typography>
          <AddEditPage initialData={selectedDistrictItem ?? undefined} onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            id="branch-form-submit"
            onClick={handleFormSubmit}
          >
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
