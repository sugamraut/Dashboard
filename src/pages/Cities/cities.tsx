
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  TextField,
  Stack,
  TablePagination,
  Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchAllCities,
  fetchCityBypaginated,
} from "../../store/cities/CitiesSlice";
import AddEditCity from "./edit";
import type { City } from "../../globals/typeDeclaration";

export default function CityPage() {
  const dispatch = useDispatch<AppDispatch>();

  const fulldistrict = useSelector((state: RootState) => state.city.fullList);
  const cityList = useSelector((state: RootState) => state.city.list ?? []);
  const totalCount = useSelector((state: RootState) => state.city.totalCount);

  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<{
    id: number;
    district: string;
  } | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCityItem, setSelectedCityItem] = useState<City | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(fetchAllCities());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCityBypaginated({
        districtId: selectedDistrict?.id,
        page: page + 1,
        rowsPerPage,
        search: search.trim() || undefined,
      })
    );
  }, [dispatch, selectedDistrict, page, rowsPerPage, search]);

  const districts = useMemo(() => {
    if (!fulldistrict) return [];

    const uniqueMap = new Map<string, { id: number; district: string }>();
    for (const item of fulldistrict) {
      const key = item.district.trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, { id: item.districtId, district: item.district });
      }
    }

    return Array.from(uniqueMap.values());
  }, [fulldistrict]);

  const handleEditClick = (city: City) => {
    setSelectedCityItem(city);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCityItem(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSelectedDistrict(null);
    setSearch("");
    setPage(0);
  };

  const sortedCityList = useMemo(() => {
    return [...cityList].sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      return a.name.localeCompare(b.name);
    });
  }, [cityList]);

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography variant="h5" fontWeight="bold" paddingBottom={2}>
          Cities
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Autocomplete
            size="small"
            sx={{ minWidth: 250 }}
            options={districts}
            getOptionLabel={(option) => option.district || "N/A"}
            value={selectedDistrict}
            onChange={(_, newValue) => {
              setSelectedDistrict(newValue);
              setPage(0);
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Filter by District" sx={{ "& .MuiOutlinedInput-root": {
              backgroundColor: "#0000000d",
              }}}/>
            )}
          />

          <TextField
            size="small"
            sx={{ minWidth: 250,"& .MuiOutlinedInput-root": {
              backgroundColor: "#0000000d",
              } }}
            label="Search by City Name"
            placeholder="Type a city name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setPage(0);
            }}
          
          />

          <IconButton
            color="error"
            onClick={handleClearFilters}
            title="Clear Filters"
          >
            <FilterAltOffIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header">State</TableCell>
              <TableCell className="table-header">District</TableCell>
              <TableCell align="center" className="table-header">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCityList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No cities found
                </TableCell>
              </TableRow>
            ) : (
              sortedCityList.map((city, index) => (
                <TableRow key={page * rowsPerPage + index + 1}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.state}</TableCell>
                  <TableCell>{city.district || "N/A"}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditClick(city)} className="action-icon-btn">
                      <EditIcon />
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

      {editDialogOpen && (
        <AddEditCity
          initialData={selectedCityItem ?? undefined}
          onClose={handleDialogClose}
        />
      )}
    </Box>
  );
}
