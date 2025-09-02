import { useEffect, useState } from "react";
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
  IconButton,
  Stack,
} from "@mui/material";

import type { RootState } from "../../store/store";
import {
  fetchBranchData,
  updateBranch,
  createBranch,
} from "../../store/branch/BranchSlice";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import BranchFormModal from "./add_edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Branch } from "../../globals/typeDeclaration";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";

export default function BranchesPage() {
  // const dispatch = useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const branches =
    useAppSelector((state: RootState) => state.branch.list) || [];
  const loading = useAppSelector((state: RootState) => state.branch.loading);
  // const error = useSelector((state: RootState) => state.branch.error);

  const [search, setSearch] = useState("");
  const [Edit, setEdit] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

  const [states] = useState<string[]>([]);
  const [districts] = useState<string[]>([]);

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
      toast.success("update the branch successfully ");
    } else {
      await dispatch(createBranch(formData));
      toast.success("createt the branch successfully");
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
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#0000000d",
              },
            }}
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

      <TableContainer>
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
                <TableCell className="table-data">
                  {branch.code || "--"}
                </TableCell>
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
