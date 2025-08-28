import {
  Box,
  CircularProgress,
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchsetting } from "../../store/setting/SettingSlice";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ADDEDIT from "./add_edit";
import type { Setting } from "../../globals/typeDeclaration";

import { toast } from "react-toastify";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { data, metaData, loading, error } = useAppSelector(
    (state) => state.setting ?? null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Setting | null>(null);

  const [page, setPage] = useState(0);
  const [rowPerPage, setRowsPerPage] = useState(25);

  const loadlogs = () => {
    dispatch(
      fetchsetting({
        page: page + 1,
        rowPerPage:rowPerPage,
        sortBy: null,
        sortOrder: "dec",
        query: "",
      })
    )
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to load settings: ${err}`);
      });
  };

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

  useEffect(() => {
    loadlogs();
  }, [page, rowPerPage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
    loadlogs();
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
          <TextField label="search" size="small" />

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
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" mt={2}>
          Error: {error}
        </Typography>
      ) : (
        <TableContainer >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">#</TableCell>
                <TableCell className="table-header">Name</TableCell>
                <TableCell className="table-header">Description</TableCell>
                <TableCell className="table-header">Value</TableCell>
                <TableCell className="table-header">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data?.map((log: Setting, index: number) => (
                  <TableRow
                    key={log.id}
                    sx={{
                      "& .MuiTableCell-root": {
                        padding: "6px",
                      },
                    }}
                  >
                    <TableCell className="table-data">
                     {page * rowPerPage + index + 1}
                      {/* {index + 1} */}

                    </TableCell>
                    <TableCell className="table-data">{log.name}</TableCell>
                    <TableCell className="table-data">
                      {log.description}
                    </TableCell>
                    <TableCell className="table-data">{log.value}</TableCell>
                    <TableCell className="table-data">
                      <IconButton
                        className="action-icon-btn"
                        onClick={() => handleOpenEdit(log)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="action-icon-btn-delete m-2 p-6"
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editData ? "Edit Setting" : "Add Setting"}</DialogTitle>
        <DialogContent
          sx={{
            "&.MuiDialogContent-root": {
              padding: "0px",
            },
          }}
        >
          <ADDEDIT
            initialData={editData}
            onSuccess={() => {
              handleCloseDialog();
              loadlogs();
              toast.success(
                editData
                  ? "Setting updated successfully"
                  : "Setting created successfully"
              );
            }}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Setting;
