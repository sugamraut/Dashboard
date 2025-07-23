import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  MenuItem,
  TextField,
  Stack,
  Select,
  InputLabel,
  Typography,
  DialogTitle,
  TablePagination,
} from "@mui/material";

import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import AddEditpage from "./add_edit_page";

interface Branch {
  id: number;
  branchName: string;
  code: string;
  telephone?: string;
  email?: string;
  fax?: string;
  state?: string;
  district?: string;
  city?: string;
  streetAddress?: string;
  wardNo?: string;
}

const initialBranches: Branch[] = [
  { id: 1, branchName: "KHUSIBU BRANCH", code: "59" },
  { id: 2, branchName: "GOLBAZAR BRANCH", code: "55" },
  { id: 3, branchName: "CHABAHIL BRANCH", code: "37" },
  { id: 4, branchName: "JANAKPUR BRANCH", code: "44" },
  { id: 5, branchName: "MID- BANESHWOR BRANCH", code: "29" },
  { id: 6, branchName: "THAMEL BRANCH", code: "09" },
  { id: 7, branchName: "DADELDHURA BRANCH", code: "19" },
  { id: 8, branchName: "GWARKO BRANCH", code: "88" },
  { id: 9, branchName: "SINAMANGAL BRANCH", code: "84" },
  { id: 10, branchName: "CHAINPUR BRANCH", code: "69" },
  { id: 11, branchName: "DHARAN BRANCH", code: "68" },
];

export default function BranchesPage() {
  const [branches] = useState<Branch[]>(initialBranches);
  const [search, setSearch] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Pagination states
  const [page, setPage] = useState(0); // current page, 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page

  const handleAddClick = () => {
    setSelectedBranch(null);
    setEditDialogOpen(true);
  };

  const handleEditClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBranch(null);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Filtered branches by search term
  const filteredBranches = branches.filter((b) =>
    b.branchName.toLowerCase().includes(search.toLowerCase())
  );

  // Paginated branches slice
  const paginatedBranches = filteredBranches.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box marginLeft={7} marginRight={0} padding={2}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="end"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold" paddingBottom={2}>
            Cities
          </Typography>
          <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>By State</InputLabel>
                <Select label="By State" value="" onChange={() => {}}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="State1">State 1</MenuItem>
                  <MenuItem value="State2">State 2</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>District</InputLabel>
                <Select label="District" value="" onChange={() => {}}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="District1">District 1</MenuItem>
                  <MenuItem value="District2">District 2</MenuItem>
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
              <IconButton color="primary" onClick={handleAddClick}>
                <AddCircleIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        <TableContainer>
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
              {paginatedBranches.length > 0 ? (
                paginatedBranches.map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {branch.branchName} ({branch.code})
                    </TableCell>
                    <TableCell>{branch.district || "Good District"}</TableCell>
                    <TableCell>{branch.branchName} -</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(branch)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No branches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredBranches.length}
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
          disableEnforceFocus
        >
          <DialogTitle>
            {selectedBranch ? "Edit Branch" : "Add Branch"}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" gutterBottom>
              {selectedBranch
                ? "Edit the details below"
                : "Please fill in the details below"}
            </Typography>

            <AddEditpage
              initialData={selectedBranch ?? undefined}
              onClose={handleDialogClose}
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="branch-form-submit"
            >
              Submit
            </Button>

            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
