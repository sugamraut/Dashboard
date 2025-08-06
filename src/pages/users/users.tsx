import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchalluser } from "../../store/user/userSlice";
import EditUser from "./EditUser";

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) =>
    Array.isArray(state.User.list) ? state.User.list : []
  );

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchalluser());
  }, [dispatch]);

  const handleEditClick = (userId: number) => {
    setSelectedUserId(userId);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setSelectedUserId(null);
  };

  return (
    <Box marginLeft={10} padding={2}>
      <Box className="header">
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField label="Search" size="small" />
          <IconButton color="error">
            <FilterAltOffIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.mobilenumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {userList.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUserId !== null && (
        <EditUser
          open={editOpen}
          handleClose={handleClose}
          userId={selectedUserId}
        />
      )}
    </Box>
  );
};

export default User;
