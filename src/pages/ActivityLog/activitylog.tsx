import {
  Autocomplete,
  Box,
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
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect, useState, useMemo } from "react";
import { fetchActivityLog } from "../../store/activitylogs/ActivitySlice";
import ClearIcon from "@mui/icons-material/FilterAltOff";
import RefreshIcon from "@mui/icons-material/Refresh";

const ActivityLog = () => {
  const dispatch = useAppDispatch();
  const { data, metaData} = useAppSelector(
    (state) => state.activityLog
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  
  const userOptions = useMemo(() => {
    return Array.from(
      new Map(
        data
          .filter((log) => log.user?.username)
          .map((log) => [
            log.user!.username,
            {
              username: log.user!.username,
              name: log.user!.name,
            },
          ])
      ).values()
    );
  }, [data]);


  // const roleOptions = useMemo(() => {
  //   return Array.from(
  //     new Set(
  //       data
  //         .flatMap(
  //           (log) =>
  //             log.user?.roles?.map((role: { name: any; }) => ({
  //               label: role.name,
  //               value: role.name,
  //             })) ?? []
  //         )
  //         .map((r) => JSON.stringify(r))
  //     )
  //   ).map((r) => JSON.parse(r));
  // }, [data]);

  const loadLogs = () => {
    const filters: Record<string, any> = { type: 0 };
    if (selectedUser) filters["user"] = selectedUser;
    if (selectedRole) filters["role"] = selectedRole;

    dispatch(
      fetchActivityLog({
        page: page + 1,
        rowsPerPage,
        sortBy: null,
        sortOrder: "desc",
        query: "",
        filters,
      })
    );
  };

  useEffect(() => {
    loadLogs();
  }, [selectedDate, page, rowsPerPage, selectedUser, selectedRole]);

  const handleClearFilter = () => {
    setSelectedDate(null);
    setSelectedUser(null);
    setSelectedRole(null);
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
    <Box marginLeft={9} padding={2}>
      <Box className="header" mb={2}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#043BA0"
          fontSize={24}
        >
          Activity Log
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* User Filter */}
          <Autocomplete
            disablePortal
            options={userOptions}
            getOptionLabel={(option) => `${option.username} (${option.name})`}
            // filterOptions={(options, { inputValue }) =>
            //   options.filter(
            //     (opt) =>
            //       opt.username
            //         .toLowerCase()
            //         .includes(inputValue.toLowerCase()) ||
            //       opt.name.toLowerCase().includes(inputValue.toLowerCase())
            //   )
            // }
            value={
              selectedUser
                ? (userOptions.find((u) => u.username === selectedUser) ?? null)
                : null
            }
            onChange={(_, newValue) =>
              setSelectedUser(newValue?.username ?? null)
            }
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by User" />
            )}
          />

          {/* <Autocomplete
            disablePortal
            // options={roleOptions}
            // value={
            //   selectedRole
            //     ? (roleOptions.find((r) => r.value === selectedRole) ?? null)
            //     : null
            // }
            onChange={(_, newValue) => setSelectedRole(newValue?.value ?? null)}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Role" />
            )}
          /> */}

          <TextField
            size="medium"
            placeholder="Search by name or group"
            margin="normal"
          />

       
          <IconButton onClick={handleClearFilter} color="error">
            <ClearIcon />
          </IconButton>
          <IconButton onClick={handleRefresh} color="error">
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>User Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((log, index) => (
                <TableRow key={log.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell className="table-data">
                    {new Date(log.createdDate).toISOString().split("T")[0]}
                  </TableCell>

                  <TableCell>{log.description}</TableCell>
                  <TableCell>
                    {log.user?.username||"-"}
                    <br />
                    <Typography variant="body2" color="textSecondary">
                      ({log.user?.name || "-"})
                    </Typography>
                  </TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.userAgent}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Activity Logs found
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
    </Box>
  );
};

export default ActivityLog;
