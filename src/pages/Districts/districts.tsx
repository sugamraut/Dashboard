import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
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
   const districtList = useSelector(
    (state: RootState) => state.distric.data
  );

  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDistrictItem, setSelectedDistrictItem] = useState<any | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchDistrictAsync());
  }, [dispatch]);

  const filteredDistricts =
    districtList?.filter((d: any) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchesDistrictFilter =
        !selectedDistrict || String(d.id) === selectedDistrict;
      return matchesSearch && matchesDistrictFilter;
    }) || [];
    
  const paginatedDistricts = filteredDistricts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFormSubmit = () => {
    handleDialogClose();
  };

  return (
    <Box marginLeft={10} padding={2}>
        <Box className="table-header">
          <Typography variant="h5" fontWeight="bold" paddingBottom={2}>
            Districts
          </Typography>
          <Stack direction="row" spacing={2}>
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
                  {(districtList ?? []).map((d: any) => (
                <MenuItem key={d.id} value={String(d.id)}>
                  {d.name}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton color="error" onClick={() => setSearch("")}>
              <FilterAltOffIcon />
            </IconButton>
          </Stack>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="fs-3 text-primary text-opacity-50">#</TableCell>
                <TableCell className="fs-3 text-primary text-opacity-50">Name</TableCell>
                <TableCell className="fs-3 text-primary text-opacity-50">State</TableCell>
                <TableCell className="fs-3 text-primary text-opacity-50">District</TableCell>
                <TableCell align="center" className="fs-3 text-primary text-opacity-50">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDistricts.map((district: any, index: number) => (
                <TableRow key={district.id} >
                  <TableCell className="fs-5">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell className="fs-5">{district.name}</TableCell>
                  <TableCell className="fs-5">{district.state?.name || "N/A"}</TableCell>
                  <TableCell className="fs-5">
                    {district.nameCombined || district.name}
                  </TableCell>
                  <TableCell align="center" className="fs-5">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(district)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        alert(
                          `Delete district ${district.name} (id: ${district.id})`
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedDistricts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No districts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredDistricts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Dialog
          open={editDialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedDistrictItem ? "Edit District" : "Add District"}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" gutterBottom>
              {selectedDistrictItem
                ? "Edit the details below"
                : "Please fill in the details below"}
            </Typography>
            <AddEditPage
              initialData={selectedDistrictItem ?? undefined}
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
    // </Box>
  );
}
