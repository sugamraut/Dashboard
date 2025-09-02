import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { useEffect, useMemo } from "react";
import { fetchOnlineAccount } from "../../store/onlineaccount/OnlineAccountSlice";
import EditIcon from "@mui/icons-material/Edit";

import SearchIcon from "@mui/icons-material/Search";
// import dayjs from "dayjs";

const OnlineAccountRequest = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state: RootState) => state.onlineAccount.list ?? []
  );

  useEffect(() => {
    dispatch(fetchOnlineAccount());
  });
  
  return (
    <Box marginLeft={10} padding={2}>
      <Box
        className="header"
        sx={{
          "& .MuiTypography-root": {
            paddingBottom: 0,
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          paddingBottom={2}
          sx={{ color: "#043ba0", fontFamily: "lato" }}
        >
          Online Account Request
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl component="fieldset">
            <FormControlLabel
              value="end"
              control={
                <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }} />
              }
              label="Trashed?"
              labelPlacement="end"
            />
          </FormControl>

          {/* <Autocomplete
            sx={{
              "& .MuiOutlinedInput-root": {
                minWidth: 200,
              },
            }}
            disablePortal
            options={top100Films}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Movie"
                sx={{
                  "&.css-19qnlrw-MuiFormLabel-root-MuiInputLabel-root ": {
                    bottom: "23px",
                  },
                }}
              />
            )}
          /> */}
       

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{
                // bottom: "4px",
                // "& .MuiPickersTextField-root": {
                //   maxWidth: "200px",
                // }
                "& .MuiOutlinedInput-root ": {
                  width: "200px",
                  padding: " 12.5px 0px 12.5px 0px",
                },
              }}
            >
              <DatePicker
                label="Basic date picker"
                sx={{
                  bottom: "4px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0000000d",
                  },
                  " & .MuiPickersOutlinedInput-sectionsContainer": {
                    width: "200px",
                    padding: " 12.5px 0px 12.5px 0px",
                    backgroundColor: "red",
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <FormControl
            sx={{
              m: 1,
              width: "200px",
            }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Search
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={{
                " & .MuiOutlinedInput-input": {
                  padding: "12.5px 0px 12.5px 0px",
                  backgroundColor: "#0000000d",
                },
              }}
            />
          </FormControl>
          <IconButton color="error">
            <FilterAltOffIcon />
          </IconButton>
        </Stack>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                className="table-header"
                sx={{
                  "& .MuiFormControl-root": {
                    verticalAlign: "inherit",
                  },
                }}
              >
                <FormControl component="fieldset">
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                      />
                    }
                    label=""
                    labelPlacement="end"
                  />
                </FormControl>
                #
              </TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header"> Status</TableCell>
              <TableCell className="table-header"> created At</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length > 0 ? (
              list.map((onlineAccount, index) => (
                <TableRow key={onlineAccount.id}>
                  <TableCell className="table-data">{index + 1}</TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.firstname} {onlineAccount.middleName}{" "}
                    {onlineAccount.lastName}
                  </TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.status}
                  </TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.createdate}
                  </TableCell>
                  <TableCell className="table-data">
                    <IconButton className="action-icon-btn">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No Online Request Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OnlineAccountRequest;
