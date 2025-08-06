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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchAllCities,
  fetchCityByDistrictId,
  type City,
} from "../../store/cities/CitiesSlice";

import AddEditpage from "./edit _page";
import LoadingButtons from "../demo";
import { useEffect, useMemo, useState } from "react";

interface DistrictOption {
  id: number;
  name: string;
  state: string;
}

export default function CitiesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const allCities = useSelector(
    (state: RootState) => state.city.fullList ?? []
  );
  const cities = useSelector((state: RootState) => state.city.list ?? []);
  const loading = useSelector((state: RootState) => state.city.loading);
  const error = useSelector((state: RootState) => state.city.error);

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictOption | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchAllCities());
    dispatch(fetchCityByDistrictId(1));
  }, [dispatch]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchCityByDistrictId(selectedDistrict.id));
      setPage(0);
    }
  }, [dispatch, selectedDistrict]);

  const districtOptions: DistrictOption[] = useMemo(() => {
    const seen = new Set<number>();
    return allCities
      .filter((city) => {
        if (city.districtId && !seen.has(city.districtId)) {
          seen.add(city.districtId);
          return true;
        }
        return false;
      })
      .map((city) => ({
        id: city.districtId,
        name: city.district,
        state: city.state,
      }));
  }, [allCities]);

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesSearch = city.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesState = !selectedState || city.state === selectedState;
      return matchesSearch && matchesState;
    });
  }, [cities, search, selectedState]);

  const paginatedCities = useMemo(() => {
    return filteredCities.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredCities, page, rowsPerPage]);

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

  const handleRefresh = () => {
    setSearch("");
    setSelectedState("");
    setSelectedDistrict(null);
    setPage(0);
    dispatch(fetchAllCities());
    dispatch(fetchCityByDistrictId(1));
  };

  return (
    <Box marginLeft={9} padding={2}>
      <Box className="header" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Cities
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            size="small"
            sx={{ minWidth: 220 }}
            options={districtOptions}
            getOptionLabel={(option) => option.name}
            value={selectedDistrict}
            onChange={(_, newValue) => setSelectedDistrict(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="District" size="small" />
            )}
          />

          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <IconButton
            color="error"
            onClick={handleRefresh}
            title="Reset filters"
          >
            <FilterAltOffIcon />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => handleEditClick(null)}
            title="Add City"
          >
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      {loading && <LoadingButtons />}
      {error && (
        <Typography color="error" variant="body2" mb={1}>
          Error: {error}
        </Typography>
      )}

      <TableContainer>
        <Table size="small">
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
            {paginatedCities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No cities found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell>{city.id}</TableCell>
                  <TableCell>{city.name || city.nameCombined}</TableCell>
                  <TableCell>{city.state || "N/A"}</TableCell>
                  <TableCell>{city.district || "N/A"}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(city)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredCities.length}
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
        <DialogActions 
        // sx={{ justifyContent: "space-between", px: 3 }}
        >
          <Box mt={3} textAlign="right" gap={2} sx={{ mr: 2 }} >
              <Button color="error" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogClose}
          >
            Submit
          </Button>

          </Box>
        
          
        </DialogActions>
      </Dialog>
    </Box>
  );
}
