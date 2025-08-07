import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchBranchData,
  updateBranch,
  createBranch,
  type Branch,
} from "../../store/branchSlice/BranchSlice";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import BranchFormModal from "./add_edit_page";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BranchesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: RootState) => state.branch.list) || [];
  const loading = useSelector((state: RootState) => state.branch.loading);
  // const error = useSelector((state: RootState) => state.branch.error);

  const [search, setSearch] = useState("");
  const [Edit, setEdit] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchBranchData());
  }, [dispatch]);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  function openModal(branch?: Branch) {
    if (branch) {
      setEditBranch(branch);
    } else {
      setEditBranch(null);
    }
    setEdit(true);
  }

  async function handleFormSubmit(formData: any) {
    if (editBranch) {
      await dispatch(
        updateBranch({
          id: editBranch.id,
          data: formData,
        })
      );
    } else {
      await dispatch(createBranch(formData));
    }
    dispatch(fetchBranchData());
  }

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography variant="h5" fontWeight="bold" marginBottom={2}>
          Branches
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
          <TextField
            size="small"
            placeholder="Search branch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton color="error" onClick={() => setSearch("")}>
            <FilterAltOffIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => openModal()}
            title="Add City"
          >
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Branch Name</TableCell>
              <TableCell className="table-header">Code</TableCell>
              <TableCell className="table-header">District</TableCell>
              <TableCell className="table-header">State</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}

            {filteredBranches.map((branch, i) => (
              <TableRow key={branch.id}>
                <TableCell className="table-data">{i + 1}</TableCell>
                <TableCell className="table-data">{branch.name}</TableCell>
                <TableCell className="table-data">{branch.code || "--"}</TableCell>
                <TableCell className="table-data">{branch.district}</TableCell>
                <TableCell className="table-data">{branch.state}</TableCell>
                <TableCell className="table-data">
                  <IconButton onClick={() => openModal(branch)}>
                    <EditIcon />
                  </IconButton>
                   <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredBranches.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No branches found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <BranchFormModal
        open={Edit}
        onClose={() => setEdit(false)}
        initialData={
          editBranch
            ? {
                branchName: editBranch.name,
                code: editBranch.code || "",
                state: editBranch.state,
                district: editBranch.district,
              }
            : null
        }
        onSubmit={handleFormSubmit}
        states={states}
        districts={districts}
      />
    </Box>
  );
}
