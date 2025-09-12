import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  deleteAccountType,
  fetchAccountTypes,
} from "../../store/account/AccountSlice";
import AddEditPage from "./add_edit";
import ConfirmDeleteDialog from "./delete";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";
import Loading from "../loader";
import type { AccountType } from "../../globals/typeDeclaration";

const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, loading, metaData, data } = useAppSelector(
    (state: RootState) => state.accountTypes
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(
    null
  );

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  const fetchData = () => {
    dispatch(
      fetchAccountTypes({
        page: 1,
        rowsPerPage,
        sortBy: "id",
        sortOrder: "asc",
      })
    );
  };

  useEffect(() => {
    fetchData();
    if (error) toast.error(error);
  }, [dispatch, error]);

  const handleAdd = () => {
    setEditingAccount(null);
    setDialogOpen(true);
  };

  const handleEdit = (a: AccountType) => {
    setEditingAccount(a);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAccount(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await dispatch(deleteAccountType(selectedId)).unwrap();
      toast.success("Account type deleted successfully.");
      fetchData(); // refresh table after deletion
    } catch (err: any) {
      toast.error(err || "Failed to delete account type.");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography
          variant="h5"
          fontWeight="bold"
          marginBottom={2}
          sx={{ color: "#043ba0", fontFamily: "lato" }}
        >
          Account Types
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#0000000d",
              },
            }}
          />
          <IconButton color="primary" onClick={handleAdd}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Title</TableCell>
              <TableCell className="table-header">Details</TableCell>
              <TableCell className="table-header">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((account: AccountType, index: number) => (
                <TableRow key={account.id}>
                  <TableCell className="table-data">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="table-data">
                    {account.title} : {account.code}
                  </TableCell>
                  <TableCell className="table-data">
                    Interest: {account.interest || ""}
                  </TableCell>
                  <TableCell className="table-data">
                    <IconButton
                      onClick={() => handleEdit(account)}
                      className="action-icon-btn"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      className="action-icon-btn-delete ms-2"
                      onClick={() => handleDeleteClick(account.id)}
                    >
                      <DeleteIcon />
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
        count={metaData?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {dialogOpen && (
        <AddEditPage
          initialData={{
            title: editingAccount?.title || "",
            code: editingAccount?.code || "",
            interest: editingAccount?.interest || "",
            description: editingAccount?.description || "",
            minimumblance: editingAccount?.minBalance || "",
            imageUrl: editingAccount?.imageUrl || "",
          }}
          onCancel={handleClose}
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

export default AccountPage;
