import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  deletePermission,
  fetchPermissions,
} from "../../store/Permission/PermissionSlice";
import type { RootState } from "../../store/store";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddEditPage from "./add_edit";
import type { Permission } from "../../globals/typeDeclaration";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import useDocumentTitle from "../../globals/useBrowserTitle";
import ConfirmDeleteDialog from "../../components/Delete_Model";

const Permissions: React.FC = () => {
  const dispatch = useAppDispatch();
  useDocumentTitle("Permission - SNLI");
  const { data, metaData, error } = useAppSelector(
    (state: RootState) => state.permissions
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchPermissions({
        page: page + 1,
        rowsPerPage,
        query: searchQuery,
        sortBy: null,
        sortOrder: "desc",
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setPage(0);
    dispatch(
      fetchPermissions({
        page: 1,
        rowsPerPage,
        query: "",
        sortBy: null,
        sortOrder: "desc",
      })
    );
  };

  const handleAddClick = () => {
    setEditingPermission(null);
    setOpenDialog(true);
  };

  const handleEditClick = (permission: Permission) => {
    setEditingPermission(permission);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPermission(null);

    dispatch(
      fetchPermissions({
        page: page + 1,
        rowsPerPage,
        query: searchQuery,
        sortBy: null,
        sortOrder: "desc",
      })
    );
  };

  // const handleDelete = async (id: number) => {
  //   if (window.confirm("Are you sure you want to delete this role?")) {
  //     await dispatch(deletePermission(id))
  //       .unwrap()
  //       .then(() => {
  //         dispatch(
  //           fetchPermissions({
  //             page: 1,
  //             rowsPerPage,
  //             query: "",
  //             sortBy: null,
  //             sortOrder: "desc",
  //           })
  //         );
  //       })
  //       .catch((error) => {
  //         toast.error(`Delete failed: ${error}`);
  //       });
  //   }
  // };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      await dispatch(deletePermission(selectedId)).unwrap();
      toast.success("Permission deleted successfully");
      fetchPermissions({
        page: 1,
        rowsPerPage,
        query: "",
        sortBy: null,
        sortOrder: "desc",
      });
    } catch (error: any) {
      toast.error(error || "failed to deleted permission type");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedId(null);
    }
  };
  return (
    <Box marginLeft={9} padding={2}>
      <Box className="header" mb={2}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#043BA0"
          fontSize={24}
          fontFamily="lato"
        >
          Permissions
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by name or group"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-input ": {
                backgroundColor: "#0000000d",
              },
            }}
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
            title="Add Permission"
            onClick={handleAddClick}
          >
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Display Name</TableCell>
              <TableCell className="table-header">Action Type</TableCell>
              <TableCell className="table-header">Group</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && (
              <Typography color="error" mb={2}>
                Error: {error}
              </Typography>
            )}
            {data.length > 0 ? (
              data.map((permission, index) => (
                <TableRow key={permission.id}>
                  <TableCell className="table-data">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="table-data">
                    {permission.displayName}
                  </TableCell>
                  <TableCell className="table-data">
                    {permission.name}
                  </TableCell>
                  <TableCell className="table-data">
                    {permission.group}
                  </TableCell>
                  <TableCell className="table-data">
                    <IconButton
                      onClick={() => handleEditClick(permission)}
                      className="action-icon-btn"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      className="action-icon-btn-delete m-2 p-6"
                      onClick={() => handleDeleteClick(permission.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No permissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={metaData?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {openDialog && (
        <AddEditPage
          initialData={editingPermission ?? undefined}
          onClose={handleCloseDialog}
        />
      )}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        id={selectedId}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default Permissions;
