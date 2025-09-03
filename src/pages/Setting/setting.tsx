import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchsetting } from "../../store/setting/SettingSlice";
import ADDEDIT from "./add_edit";
import type { Setting } from "../../globals/typeDeclaration";
import { toast } from "react-toastify";
import Loading from "../loader";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { data, metaData, loading, error } = useAppSelector(
    (state) => state.setting ?? null
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Setting | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchsetting({
        page: page + 1,
        rowPerPage: rowPerPage,
        sortBy: null,
        sortOrder: "dec",
        query: debouncedSearchQuery,
      })
    )
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to load settings: ${err}`);
      });
  }, [page, rowPerPage, debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (setting: Setting) => {
    setEditData(setting);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
  };

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
    setDebouncedSearchQuery("");
    setPage(0);
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
          Settings
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Search"
            size="small"
            sx={{
              "& .MuiOutlinedInput-input": { backgroundColor: "#0000000d" },
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton color="error" onClick={handleRefresh}>
            <FilterAltOffIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleOpenAdd}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Box>

      {loading ? (
        <Box mt={2} display="flex" justifyContent="center">
          <Loading />
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((log: Setting, index: number) => (
                  <TableRow
                    key={log.id}
                    sx={{ "& .MuiTableCell-root": { padding: "6px" } }}
                  >
                    <TableCell>{page * rowPerPage + index + 1}</TableCell>
                    <TableCell>{log.name}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.value}</TableCell>
                    <TableCell>
                      <IconButton
                        className="action-icon-btn"
                        onClick={() => handleOpenEdit(log)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="action-icon-btn-delete m-xxl-2 p-6"
                        disabled
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={metaData?.total || 0}
            page={page}
            rowsPerPage={rowPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {openDialog && (
        <ADDEDIT
          initialData={editData}
          onSuccess={() => {
            handleCloseDialog();
            dispatch(
              fetchsetting({
                page: page + 1,
                rowPerPage: rowPerPage,
                sortBy: null,
                sortOrder: "dec",
                query: debouncedSearchQuery,
              })
            );
            toast.success(
              editData
                ? "Setting updated successfully"
                : "Setting created successfully"
            );
          }}
          onCancel={handleCloseDialog}
        />
      )}
    </Box>
  );
};

export default Setting;
