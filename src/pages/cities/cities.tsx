import React, { useEffect, useMemo, useState } from "react";
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
  fetchAllCitiesAsync,
  fetchCityByDistrictIdAsync,
  type City,
} from "../../store/cities/CitiesSlice";

import AddEditpage from "./edit _page";
import LoadingButtons from "../demo";

interface DistrictOption {
  id: number;
  name: string;
  state: string;
}

export default function CitiesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const allCities = useSelector((state: RootState) => state.city.fullList ?? []);
  const districtCities = useSelector((state: RootState) => state.city.list ?? []);
  const loading = useSelector((state: RootState) => state.city.loading);
  const error = useSelector((state: RootState) => state.city.error);

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchAllCitiesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchCityByDistrictIdAsync(selectedDistrict.id));
      setPage(0);
    }
  }, [dispatch, selectedDistrict]);

  const districtList: DistrictOption[] = useMemo(() => {
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

  const stateOptions = useMemo(() => {
    const states = allCities.map((city) => city.state?.trim()).filter(Boolean);
    return Array.from(new Set(states)).sort();
  }, [allCities]);

  const citiesToDisplay = useMemo(() => {
  if (!selectedDistrict) return allCities;

  return districtCities.map((city) => {
    const fullInfo = allCities.find((c) => Number(c.id) === Number(city.id));
    return {
      ...city,
      state: fullInfo?.state ?? "N/A",
      district: fullInfo?.district ?? city.district ?? "N/A",
    };
  });
}, [selectedDistrict, districtCities, allCities]);


  const filtered = useMemo(() => {
    return citiesToDisplay.filter((city) => {
      const matchesSearch = city.name?.toLowerCase().includes(search.toLowerCase());
      const matchesState = !selectedState || city.state === selectedState;
      return matchesSearch && matchesState;
    });
  }, [citiesToDisplay, search, selectedState]);

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    dispatch(fetchAllCitiesAsync());
  };
  // console.log(districtCities)
  // console.log(allCities);
  

  return (
    <Box marginLeft={9} padding={2}>
      <Box className="header" mb={2}>
        <Typography variant="h5" fontWeight="bold">Cities</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            size="small"
            sx={{ minWidth: 200 }}
            options={stateOptions}
            getOptionLabel={(option) => option}
            value={selectedState}
            onChange={(_, newValue) => setSelectedState(newValue || "")}
            renderInput={(params) => <TextField {...params} label="State" size="small" />}
          />

          <Autocomplete
            size="small"
            sx={{ minWidth: 220 }}
            options={districtList}
            getOptionLabel={(option) => option.name}
            value={selectedDistrict}
            onChange={(_, newValue) => setSelectedDistrict(newValue)}
            renderInput={(params) => <TextField {...params} label="District" size="small" />}
          />

          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <IconButton color="error" onClick={handleRefresh} title="Reset filters">
            <FilterAltOffIcon />
          </IconButton>

          <IconButton color="primary" onClick={() => handleEditClick(null)} title="Add City">
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
            {districtCities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No cities found.
                </TableCell>
              </TableRow>
            ) : (
              districtCities.map((city) => (
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
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedCity ? "Edit City" : "Add City"}</DialogTitle>
        <DialogContent dividers>
          <AddEditpage initialData={selectedCity!} onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button variant="contained" color="primary" onClick={handleDialogClose}>
            Submit
          </Button>
          <Button color="error" onClick={handleDialogClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );  
}
