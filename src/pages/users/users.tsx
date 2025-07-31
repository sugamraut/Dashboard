import { useEffect } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchalluser } from "../../store/user/userSlice";

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) =>
    Array.isArray(state.User.list) ? state.User.list : []
  );

  useEffect(() => {
    dispatch(fetchalluser());
  }, [dispatch]);

  return (
    <Box marginLeft={10} padding={2}>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <Typography variant="h6">Users</Typography>
        <TextField size="small" sx={{ minWidth: 250 }} label="Search" />
        <IconButton>
          <FilterAltOffIcon />
        </IconButton>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
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
                <TableCell>--</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default User;
