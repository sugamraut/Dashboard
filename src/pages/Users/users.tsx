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
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchAllUsers } from "../../store/user/UserSlice";
import EditUser from "./EditUser";

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) =>
    Array.isArray(state.User.list) ? state.User.list : []
  );

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEditClick = (userId: number) => {
    setSelectedUserId(userId);
    setEditOpen(true);
  };

  // const handelAddClick =()=>{
  //   selectedUserId(null)
  //   setEditOpen(true)
  // }
  const handleAddClick = () => {
    setSelectedUserId(null);
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
          Users
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField label="Search" size="small" 
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#0000000d",
            }
          }}
          />
          <IconButton color="error">
            <FilterAltOffIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleAddClick}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header">Username</TableCell>
              <TableCell className="table-header">Mobile No</TableCell>
              <TableCell className="table-header">Email</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="table-data">{index + 1}</TableCell>
                <TableCell className="table-data">{user.name}</TableCell>
                <TableCell className="table-data">{user.username}</TableCell>
                <TableCell className="table-data">
                  {user.mobilenumber}
                </TableCell>
                <TableCell className="table-data">{user.email}</TableCell>
                <TableCell className="table-data">
                  <IconButton
                    className="action-icon-btn "
                    onClick={() => handleEditClick(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    className="action-icon-btn-delete ms-2"
                  >
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
      {editOpen && (
        <EditUser
          open={editOpen}
          onClose={handleClose}
          userId={selectedUserId}
        />
      )}
    </Box>
  );
};

export default User;
