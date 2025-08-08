import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermissions,
  type Permission,
} from "../../store/Permission/permissionSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "../../store/store";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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

const Permissions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, metaData, loading, error } = useSelector(
    (state: RootState) => state.permissions
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

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
    setRowsPerPage(parseInt(event.target.value, 25));
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

  return (
    <Box marginLeft={9} padding={2}>
      <Box className="header" mb={2}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#043BA0"
          fontSize={24}
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
          />

          <IconButton
            color="error"
            onClick={handleRefresh}
            title="Reset filters"
          >
            <FilterAltOffIcon />
          </IconButton>

          <IconButton color="primary" title="Add Permission">
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      {loading && <Typography>Loading permissions...</Typography>}
      {error && (
        <Typography color="error" mb={2}>
          Error: {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Display Name</TableCell>
              <TableCell className="table-header">Name</TableCell>

              <TableCell className="table-header">Group</TableCell>
              <TableCell className="table-header">Action Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((perm: Permission, index: number) => (
                <TableRow key={perm.id}>
                  <TableCell className="table-data">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="table-data">
                    {perm.displayName}
                  </TableCell>
                  <TableCell className="table-data">{perm.name}</TableCell>

                  <TableCell className="table-data">{perm.group}</TableCell>
                  <TableCell className="table-data">
                    <IconButton color="primary">
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
      <Dialog open={false}>
        <DialogTitle>
          Add Premission
        </DialogTitle>
        <DialogContent dividers>
          initialData={}
          on onClose={}

        </DialogContent>
      </Dialog>

   
    </Box>
  );
};

export default Permissions;
