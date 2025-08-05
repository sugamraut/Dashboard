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
  const data=useSelector((state:RootState)=>state.accountTypes.data)||null

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(
    null
  );

  useEffect(() => {
    dispatch(
      fetchAccountTypes({
        page: 1,
        rowsPerPage: 10,
        sortBy: "id",
        sortOrder: "asc",
      })
    );
  }, [dispatch]);

  const filtered = accountTypes.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography variant="h5" fontWeight="bold" marginBottom={2}>
          Account Types
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Action</TableCell>
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
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((account: any, idx: number) => (
                <TableRow key={account.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    {account.details || account.Details || ""}
                  </TableCell>
                  console.log({account});
                  <TableCell>
                    <IconButton onClick={() => handleEdit(account)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} fullWidth maxWidth="md" onClose={handleClose}>
        <DialogTitle>
          {editingAccount ? "Edit Account" : "Add Account"}
        </DialogTitle>
        <DialogContent dividers>
          <AddEditPage
            initialData={{
              title: editingAccount?.name || "",
              code: editingAccount?.code || "",
              interest: editingAccount?.interest || "",
              details: editingAccount?.details || "",
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
