import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
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
  type DialogProps,
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
import React from "react";

function RolePage() {
  const dispatch = useAppDispatch();
  const { list } = useSelector((state: RootState) => state.roles);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
    setOpenDialog(true);
    setEditData(null);
    setScroll(scrollType);
  };

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
      <TableContainer>
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
                    <IconButton
                      color="primary"
                      className="action-icon-btn me-2 copy-color p-2 "
                    >
                      <FileCopyIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(role)}
                      className="action-icon-btn me-2  "
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      className="action-icon-btn-delete me-2"
                    >
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
      {openDialog && (
        <ADDEDIT
          initialData={editData ?? undefined}
          onCancel={handleCloseDialog}
        />
      )}
    </Box>
  );
}

export default RolePage;
