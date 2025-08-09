import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TablePagination,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  fetchAccountTypes,
  type AccountType,
} from "../../store/Account/AccountSlice";
import AddEditPage from "./add_edit_pages";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const AccountPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: accountTypes,
    error,
    loading,
  } = useAppSelector((state) => state.accountTypes);
  const data = useSelector((state: RootState) => state.accountTypes.data) || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);


  useEffect(() => {
    dispatch(
      fetchAccountTypes({
        page: 1,
        rowsPerPage: 1000, 
        sortBy: "id",
        sortOrder: "asc",
      })
    );
  }, [dispatch]);

  
  const filtered = data.filter((a) =>
    (a.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleSave = (data: {
    title: string;
    code: string;
    interest: string;
    details: string;
  }) => {
    console.log(editingAccount ? "Update" : "Add new", {
      name: data.title,
      code: data.code,
      interest: data.interest,
      details: data.details,
    });
    handleClose();
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

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography variant="h5" fontWeight="bold" marginBottom={2}>
          Account Types
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          marginBottom={2}
        >
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); 
            }}
          />
          <IconButton color="primary" onClick={handleAdd}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((account: AccountType, index: number) => (
                <TableRow key={account.id}>
                  <TableCell className="table-data">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="table-data">
                    {account.title} : {account.code}
                  </TableCell>
                  <TableCell className="table-data">
                    Interest: {account.interest || account.details || ""}
                  </TableCell>
                  <TableCell className="table-data">
                    <IconButton
                      onClick={() => handleEdit(account)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
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
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  
      <Dialog open={dialogOpen} fullWidth maxWidth="md" onClose={handleClose}>
        <DialogTitle>
          {editingAccount ? "Edit Account" : "Add Account"}
        </DialogTitle>
        <DialogContent dividers>
          <AddEditPage
            initialData={{
              title: editingAccount?.title || "",
              code: editingAccount?.code || "",
              interest: editingAccount?.interest || "",
              details: editingAccount?.description || "",
              minimumblance:editingAccount?.minBalance ||"",
              insurance:editingAccount?.insurance || "",
              imageUrl:editingAccount?.imageUrl || "",
            }}
            onSave={handleSave}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
