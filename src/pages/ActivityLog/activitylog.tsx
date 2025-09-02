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
import { red } from "@mui/material/colors";

const ActivityLog = () => {
  const dispatch = useAppDispatch();
  const { data, metaData } = useAppSelector((state) => state.activityLog);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // const userOptions = useMemo(() => {
  //   return Array.from(
  //     new Map(
  //       data
  //         .filter((log) => log.user?.username)
  //         .map((log) => [
  //           log.user!.username,
  //           {
  //             username: log.user!.username,
  //             name: log.user!.name,
  //           },
  //         ])
  //     ).values()
  //   );
  // }, [data]);

  const userOptions = useMemo(() => {
    const userSet = new Set<string>();
    const uniqueUsers: { username: string; name: string }[] = [];

    data.forEach((log) => {
      const user = log.user;
      if (user?.username && !userSet.has(user.username)) {
        userSet.add(user.username);
        uniqueUsers.push({
          username: user.username,
          name: user.name,
        });
      }
    });

    return uniqueUsers;
  }, [data]);

  const loadLogs = () => {
    const filters: Record<string, any> = { type: 0 };
    dispatch(
      fetchActivityLog({
        page: page + 1,
        rowsPerPage,
        sortBy: null,
        sortOrder: "desc",
        query: debouncedQuery,
        filters,
      })
    );
  };

  useEffect(() => {
    loadLogs();
  }, [
    selectedDate,
    page,
    rowsPerPage,
    selectedUser,
    selectedRole,
    debouncedQuery,
  ]);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const roleOptions = useMemo(() => {
    const roleSet = new Set<string>();

    data.forEach((log) => {
      log.user?.roles?.forEach((role: { name: string }) => {
        if (role.name) {
          roleSet.add(role.name);
        }
      });
    });

    return Array.from(roleSet).map((role) => ({
      label: role,
      value: role,
    }));
  }, [data]);

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
            value={
              selectedUser
                ? userOptions.find((u) => u.username === selectedUser) ?? null
                : null
            }
            onChange={(_, newValue) =>
              setSelectedUser(newValue?.username ?? null)
            }
            sx={{
              width: 200,
              "& .MuiInputBase-root,.MuiOutlinedInput-root ": {
                // FontFace: "Lato",
                fontFamily: "Lato",
                backgroundColor: "#0000000d",
              },
              "& .MuiOutlinedInput-root":{
                padding:"4.5px"
              }
              
            }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by User" />
            )}
          />

          <Autocomplete
            disablePortal
            options={roleOptions}
            value={
              selectedRole
                ? roleOptions.find((r) => r.value === selectedRole) ?? null
                : null
            }
            onChange={(_, newValue) => {
              setSelectedRole(newValue?.value ?? null);
              setPage(0);
            }}
            sx={{
              width: 200,
              "& .MuiInputBase-root,.MuiOutlinedInput-root ": {
                fontFamily: "Lato",
                backgroundColor: "#0000000d",
              },
              "& .MuiOutlinedInput-root":{
                padding:"4.5px"
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Role" />
            )}
          />

          <TextField
            size="medium"
            placeholder="Search by name or group"
            margin="normal"
            sx={{
              "& .MuiInputBase-root,.MuiOutlinedInput-root ": {
                fontFamily: "Lato",
                width: 200,
                backgroundColor: "#0000000d",
              
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 6px",
              },
            }}
           
            label="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />

          <IconButton onClick={handleClearFilter} color="error">
            <ClearIcon />
          </IconButton>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>

      <TableContainer>
        <Table>
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
              data.map((log, index) => (
                <TableRow key={log.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell className="table-data">
                    {new Date(log.createdDate).toISOString().split("T")[0]}
                  </TableCell>

                  <TableCell className="table-data">
                    {log.description}
                  </TableCell>
                  <TableCell className="table-data">
                    {log.user?.username || "-"}
                    <br />
                    <Typography variant="body2" color="textSecondary">
                      ({log.user?.name || "-"})
                    </Typography>
                  </TableCell>
                  <TableCell className="table-data">{log.ip}</TableCell>
                  <TableCell className="table-data">{log.userAgent}</TableCell>
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
