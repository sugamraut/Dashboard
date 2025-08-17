import React, { useEffect, useMemo, useState } from "react";
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
  Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchAllDistrictsAsync,
  fetchDistrictAsync,
  fetchDistrictByIdAsync,
  fetchDistrictsByStateIdAsync,
} from "../../store/districts/DistrictsSlice";
import AddEditPage from "./addedit";
import type { DistrictType } from "../../globals/typeDeclaration";
import { useAppDispatch } from "../../store/hook";

export default function DistrictPage() {
  
   const dispatch =useAppDispatch()

  const fullDistrictList = useSelector(
    (state: RootState) => state.district.fullList
  );
  const districtList = useSelector((state: RootState) =>
    Array.isArray(state.district.list) ? state.district.list : []
  );
  const totalCount = useSelector(
    (state: RootState) => state.district.totalCount ?? 0
  );

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<null | {
    id: number;
    name: string;
    nameNp?: string;
  }>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDistrictItem, setSelectedDistrictItem] =
    useState<DistrictType | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAllDistrictsAsync());
  }, [dispatch]);

 
useEffect(() => {
  if (selectedState) {
    dispatch(
      fetchDistrictsByStateIdAsync(selectedState.id, page + 1, rowsPerPage)
    );
  }
}, [dispatch, selectedState, page, rowsPerPage]);



  useEffect(() => {
    if (!selectedState) {
      dispatch(fetchDistrictAsync(page + 1, rowsPerPage, "", search.trim()));
    }
  }, [search, page, rowsPerPage, selectedState, dispatch]);
 
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClearFilters = () => {
    setSelectedState(null);
    setSearch("");
    setPage(0);
    dispatch(fetchDistrictAsync(1, rowsPerPage, "", ""));
  };

  const handleStateFilterChange = (_: any, newValue: any) => {
    setSelectedState(newValue);
    setPage(0);
  };

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
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
            renderInput={(params) => (
              <TextField {...params} label="Filter by State" />
            )}
          />

          <TextField
            size="small"
            sx={{ minWidth: 250 }}
            label="Search by District Name"
            placeholder="Type a district name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const district = fullDistrictList.find(
                  (d) => d.name.toLowerCase() === search.trim().toLowerCase()
                );
                if (district) {
                  dispatch(fetchDistrictByIdAsync(district.id));
                  setSelectedState(null);
                } else {
                  dispatch(fetchDistrictAsync(1, rowsPerPage, "", ""));
                }
              }
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

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header">State</TableCell>
              <TableCell align="center" className="table-header">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {districtList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No districts found
                </TableCell>
              </TableRow>
            ) : (
              districtList.map((district,index) => (
                <TableRow key={district.id}>
                  <TableCell className="table-data" sx={{ fontSize: "18px" }}>
                    {/* {page * rowsPerPage + index + 1} */}
                    {district.id}
                  </TableCell>

                  <TableCell className="table-data">{district.name}</TableCell>
                  <TableCell className="table-data">
                    {district.state?.name || "N/A"}
                  </TableCell>
                  <TableCell align="center" className="table-data">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(district)}
                    >
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
          <AddEditPage
            initialData={selectedDistrictItem ?? undefined}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
