import React, { useEffect, useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchCityAsync, type City } from "../../store/cities/CitiesSlice";
import AddEditpage from "./add_edit_page";

export default function CitiesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: cities,
    loading,
    error,
  } = useSelector((state: RootState) => state.city);

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchCityAsync());
  }, [dispatch]);

  const handleEditClick = (city: City | null) => {
    setSelectedCity(city);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCity(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleFormSubmit = () => {
    handleDialogClose();
  };

  const handleRefresh = () => {
    dispatch(fetchCityAsync());
    setSearch("");
    setSelectedState("");
    setSelectedDistrict("");
  };

  const filtered = (cities || []).filter((city: City) => {
    const matchSearch = city.name.toLowerCase().includes(search.toLowerCase());
    const matchState = !selectedState || city.state === selectedState;
    const matchDistrict =
      !selectedDistrict || city.district === selectedDistrict;
    return matchSearch && matchState && matchDistrict;
  });

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box marginLeft={9} marginRight={0} padding={2}>
      <Box className="table-header">
        <Typography variant="h5" fontWeight="bold">
          Cities
        </Typography>
        <Stack direction="row" spacing={1}>
          <Stack direction="row" spacing={2} mb={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {cities?.map((d: any) => (
                  <MenuItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>District</InputLabel>
              <Select
                label="District"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {Array.from(new Set(cities?.map((e: any) => e.district))).map(
                  (district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TextField
              label="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton color="error" onClick={handleRefresh}>
              <FilterAltOffIcon />
            </IconButton>
          </Stack>
          <IconButton color="primary" onClick={() => handleEditClick(null)}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>District</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((city, index) => (
              <TableRow key={city.id}>
                <TableCell>{city.id}</TableCell>
                <TableCell>{city.nameCombined || city.name}</TableCell>
                <TableCell>{city.state || "-"}</TableCell>
                <TableCell>{city.district || "-"}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(city)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={25} align="center">
                  No cities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedCity ? "Edit City" : "Add City"}</DialogTitle>
        <DialogContent dividers>
          <AddEditpage
            initialData={selectedCity!}
            onClose={handleDialogClose}
          />
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
