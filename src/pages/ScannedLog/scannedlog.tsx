import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TablePagination,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ClearIcon from "@mui/icons-material/FilterAltOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useEffect, useState } from "react";
import { fetchLogs } from "../../store/scannedlog/ScannedSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import dayjs, { Dayjs } from "dayjs";

const ScannedLog = () => {
  const dispatch = useAppDispatch();

  const { data, metaData, loading, error } = useAppSelector(
    (state) => state.scannedLog
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // const loadLogs = () => {
  //   dispatch(
  //     fetchLogs({
  //       page: page + 1,
  //       rowsPerPage,
  //       sortBy: null,
  //       sortOrder: "desc",
  //       query: "",
  //       // filters: selectedDate
  //       //   ? {
  //       //       date: selectedDate.format("YYYY-MM-DD"),
  //       //     }
  //       //   : undefined,
  //     })
  //   );
  // };
  const loadLogs = () => {
    dispatch(
      fetchLogs({
        page: page + 1,
        rowsPerPage,
        sortBy: null,
        sortOrder: "desc",
        query: "",
        filters: selectedDate
          ? {
              date: selectedDate.format("YYYY-MM-DD"),
            }
          : undefined,
      })
    );
  };

  useEffect(() => {
    loadLogs();
  }, [selectedDate, page, rowsPerPage]);

  const handleClearFilter = () => {
    setSelectedDate(null);
    setPage(0);
  };

  const handleRefresh = () => {
    loadLogs();
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

  return (
    <Box marginLeft={9} padding={2} mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#043ba0" }}>
          Scanned Logs
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{
                // "&.MuiPickersTextField": {
                //   maxWidth: "500px",
                //   width: "500px",
                // },
                " &.MuiPickersOutlinedInput-sectionsContainer ": {
                  width: "200px",
                  padding: " 12.5px 0px 12.5px 0px",
                },
               
                // "MuiPickersOutlinedInput-sectionsContainer"
              }}
            >
              <DatePicker
                label="By Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{ " &.MuiPickersTextField-root": {
                  backgroundColor: "#0000000d",
                },}}
              />
            </DemoContainer>
          </LocalizationProvider>

          <IconButton color="error" onClick={handleClearFilter}>
            <ClearIcon />
          </IconButton>

          <IconButton color="primary" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
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
        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">#</TableCell>
                <TableCell className="table-header">Date</TableCell>
                <TableCell className="table-header">Description</TableCell>
                <TableCell className="table-header">User</TableCell>
                <TableCell className="table-header">IP Address</TableCell>
                <TableCell className="table-header">User Agent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((log: any, index: number) => (
                  <TableRow key={log.id}>
                    <TableCell className="table-data">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="table-data">
                      {new Date(log.createdDate).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell className="table-data">
                      {log.description}
                    </TableCell>
                    <TableCell className="table-data">
                      {log.user
                        ? log.user.name || log.user.username
                        : "System Automated"}
                    </TableCell>
                    <TableCell className="table-data">
                      {log.ip || "N/A"}
                    </TableCell>
                    <TableCell className="table-data">
                      {log.userAgent || "N/A"}
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
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default ScannedLog;
