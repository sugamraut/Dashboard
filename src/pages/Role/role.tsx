
import  { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useAppDispatch } from "../../store/hook";
import { fetchRoles } from "../../store/role/RoleSlice";
import ADDEDIT from "./add_edit"; 


function RolePage() {
  const dispatch = useAppDispatch();
  const { list } = useSelector((state: RootState) => state.roles);

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles({ page: 1, rowsPerPage: 10 }));
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (role: any) => {
    setEditData(role); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography
          variant="h5"
          fontWeight="bold"
          paddingBottom={2}
          fontSize={24}
          color="#043BA0"
        >
          Roles
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField size="small" placeholder="Search" />
          <IconButton color="error">
            <FilterAltOffIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleOpenAdd}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length > 0 ? (
              list.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <FileCopyIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenEdit(role)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editData ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <ADDEDIT initialData={editData} onCancel={handleCloseDialog} />
        </DialogContent>
        
      </Dialog>
    </Box>
  );
}

export default RolePage;
